import sys
from pypdf import PdfReader

def extract_to_file(pdf_path, outfile):
    try:
        reader = PdfReader(pdf_path)
        outfile.write(f'--- {pdf_path} ---\n')
        for page in reader.pages:
            outfile.write(page.extract_text() or '')
            outfile.write('\n')
        outfile.write('\n')
    except Exception as e:
        outfile.write(f'Error reading {pdf_path}: {e}\n')

with open('parsed_pdf.txt', 'w', encoding='utf-8') as f:
    extract_to_file('grit_website_architecture.pdf', f)
    extract_to_file('grit_master_prompt.pdf', f)
