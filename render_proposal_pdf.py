from playwright.sync_api import sync_playwright
import pypdfium2 as pdfium
import os

def generate_pdf():
    html_file = "betavolt-analytics-marketing-proposal.html"
    pdf_file = "betavolt-analytics-marketing-proposal.pdf"
    html_path = os.path.abspath(html_file)
    pdf_path = os.path.abspath(pdf_file)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")
        page = browser.new_page()
        page.goto(f"file:///{html_path.replace(os.sep, '/')}", wait_until="networkidle")
        page.emulate_media(media="print")
        
        page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"},
            prefer_css_page_size=True
        )
        browser.close()
    
    print(f"Generated PDF: {pdf_path}")
    
    # Render PNGs for inspection
    pdf = pdfium.PdfDocument(pdf_path)
    print(f"Total pages in proposal PDF: {len(pdf)}")
    for i, page in enumerate(pdf):
        page.render(scale=2.0).to_pil().save(f"proposal_page_{i+1}.png")
    print("Exported proposal page preview PNGs.")

if __name__ == "__main__":
    generate_pdf()
