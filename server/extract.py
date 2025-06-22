import PyPDF2
import sys
import json

def extract_text_from_pdf(pdf_file: str) -> [str]:
    with open(pdf_file, 'rb') as pdf:
        reader = PyPDF2.PdfReader(pdf, strict=False)
        pdf_text = reader.pages[0].extract_text()

        # for page in reader.pages:
        #     content = page.extract_text()
        #     pdf_text.append(content)

        return pdf_text
    
if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    extracted_text = extract_text_from_pdf(data['path'])
    print(json.dumps({"result":extracted_text}))