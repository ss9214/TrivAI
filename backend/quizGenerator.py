from openai import OpenAI
from typing import List, Dict, Any
import json
import os
from dotenv import load_dotenv
import requests
import io
from PyPDF2 import PdfReader
from io import StringIO
import argparse

class QuizGenerator:
    def __init__(self, api_key: str = None):
        """Initialize the QuizGenerator with OpenAI API key."""
        # Load environment variables from .env file
        load_dotenv()
        
        # Try to get API key from parameter, then environment variable
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it to the constructor.")
        self.client = OpenAI(api_key=self.api_key)

    def extract_text_from_pdf_url(self, pdf_url: str = "https://arxiv.org/pdf/2007.10760") -> str:
        """
        Download and extract text from a PDF file at the given URL.
        
        Args:
            pdf_url (str): URL to the PDF file
            
        Returns:
            str: Extracted text content from the PDF
        """
        try:
            # Download the PDF file
            response = requests.get(pdf_url)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # Create a PDF reader object
            pdf_file = io.BytesIO(response.content)
            pdf_reader = PdfReader(pdf_file)
            
            # Extract text from all pages
            text_content = []
            for page in pdf_reader.pages:
                text_content.append(page.extract_text())
            
            return "\n".join(text_content)
            
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            raise ValueError(f"Failed to process PDF from URL: {str(e)}")

    def generate_quiz(self, document_input: str, num_questions: int, is_url: bool = False) -> List[Dict[str, Any]]:
        """
        Generate a quiz based on the provided document text or PDF URL.
        
        Args:
            document_input (str): Either the text content or a URL to a PDF file
            num_questions (int): Number of questions to generate
            is_url (bool): Whether the input is a URL to a PDF file
            
        Returns:
            List[Dict]: List of question dictionaries in the required format
        """
        try:
            # If input is a URL, extract text from PDF
            document_text = document_input  # Use the input directly since we already have the text

            # Prompt for GPT to generate quiz questions
            prompt = f"""
            Based on the following text, generate {num_questions} multiple-choice questions.
            Return a JSON array of questions. Each question should have this exact format:
            [
                {{
                    "text": "The question text",
                    "options": ["option1", "option2", "option3", "option4"],
                    "answer": "The correct option"
                }}
            ]
            Ensure the response is valid JSON that can be parsed directly.
            
            Text to generate questions from:
            {document_text}
            """

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful quiz generator. Generate clear, relevant multiple-choice questions based on the provided text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=1.0
            )

            # Extract the generated questions from the response
            generated_content = response.choices[0].message.content
            
            # Clean up the content
            content = generated_content.strip()
            # Remove markdown code blocks if present
            content = content.replace('```json', '').replace('```', '').strip()
            
            try:
                # Try to parse the cleaned content
                questions = json.loads(content)
                # Ensure we have a list of questions
                if not isinstance(questions, list):
                    questions = [questions]
                
                # Convert to our expected format
                formatted_questions = []
                for q in questions:
                    if all(k in q for k in ['text', 'options', 'answer']):
                        formatted_questions.append({
                            'question': q['text'],
                            'options': q['options'],
                            'correctAnswer': q['answer']
                        })
                return formatted_questions

            except Exception as e:
                print(f"Parsing error: {str(e)}")
                print(f"Content received: {content}")
                return []

        except Exception as e:
            print(f"Error generating quiz: {str(e)}")
            return []

    def validate_question_format(self, question: Dict) -> bool:
        """
        Validate if a question follows the required format.
        
        Args:
            question (Dict): Question dictionary to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        required_keys = {'question', 'options', 'correctAnswer'}
        if not all(key in question for key in required_keys):
            return False
        
        if not isinstance(question['options'], list) or len(question['options']) != 3:
            return False
            
        if question['correctAnswer'] not in question['options']:
            return False
            
        return True
    

def main(pdf_url, num_questions):
    quiz = QuizGenerator()  # Use environment variable instead of hardcoding API key
    pdf_text = quiz.extract_text_from_pdf_url(pdf_url)
    generated = quiz.generate_quiz(pdf_text, num_questions, is_url=False)
    print(generated)  # Print the actual questions

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate quiz from PDF URL.')
    parser.add_argument('pdf_url', type=str, help='The URL of the PDF to extract text from')
    parser.add_argument('num_questions', type=int, help='Number of questions to generate')
    
    args = parser.parse_args()
    main(args.pdf_url, args.num_questions)