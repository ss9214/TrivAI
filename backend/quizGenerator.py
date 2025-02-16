import openai
from typing import List, Dict, Any
import json
import os
from dotenv import load_dotenv
import requests
import io
from PyPDF2 import PdfReader
import argparse

class QuizGenerator:
    def __init__(self, api_key: str = None):
        """Initialize the QuizGenerator with OpenAI API key."""
        load_dotenv()
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required.")
        self.client = openai.OpenAI(api_key=self.api_key)

    def generate_quiz(self, document_text: str, num_questions: int) -> List[Dict[str, Any]]:
        """
        Generate a quiz based on the provided document text.
        
        Args:
            document_text (str): The text content from the uploaded document
            num_questions (int): Number of questions to generate
            
        Returns:
            List[Dict]: List of question dictionaries in the required format
        """
        try:
            # Prompt for GPT to generate quiz questions
            prompt = f"""
            Based on the following text, generate {num_questions} multiple-choice questions.
            Return a JSON array of questions. Each question should have this exact format:
            [
                {{
                    "text": "The question text",
                    "options": ["option1", "option2", "option3", "option4"],
                    "answer": "The correct option's index"
                }}
            ]
            Ensure the response is valid JSON that can be parsed directly.
            
            Text to generate questions from:
            {document_text}
            """

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful quiz generator."},
                    {"role": "user", "content": prompt}
                ],
                temperature=1.0
            )

            # Extract the generated questions from the response
            generated_content = response.choices[0].message.content
            
            # Clean up the content
            content = generated_content.strip()
            content = content.replace('```json', '').replace('```', '').strip()
            
            try:
                questions = json.loads(content)
                if not isinstance(questions, list):
                    questions = [questions]
                
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
            return {"error": str(e)}  # Return an error message as a JSON object

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
    

def main(pdf_text, num_questions):
    quiz = QuizGenerator()  # Use environment variable instead of hardcoding API key
    generated = quiz.generate_quiz(pdf_text, num_questions)

    # Ensure the output is valid JSON
    try:
        print(json.dumps(generated))  # Print the output as a JSON string
    except Exception as e:
        print(f"Error converting to JSON: {str(e)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate quiz from PDF text.')
    parser.add_argument('pdf_text', type=str, help='The text extracted from the PDF')
    parser.add_argument('num_questions', type=int, help='Number of questions to generate')
    
    args = parser.parse_args()
    main(args.pdf_text, args.num_questions)