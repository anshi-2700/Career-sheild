import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(title: str, subtitle: str, sections: list) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'ReportTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'ReportSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=15
    )
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    elements = [
        Paragraph(title, title_style),
        Paragraph(subtitle, subtitle_style),
        Spacer(1, 10)
    ]

    for sec in sections:
        elements.append(Paragraph(sec.get("heading", ""), heading_style))
        for line in sec.get("bullets", []):
            elements.append(Paragraph(f"• {line}", body_style))
        if sec.get("text"):
            elements.append(Paragraph(sec.get("text"), body_style))
        elements.append(Spacer(1, 10))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def generate_ats_resume_pdf(data: dict) -> bytes:
    """
    Generates a 100% ATS-Compliant PDF Resume matching the selected layout structure (Split 2-Column, Corporate, Tech, Minimal).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()

    template_style = data.get('template', 'tech-01')
    layout_type = data.get('layout_type', '')

    color_map = {
        'tech-01': "#059669",     # Emerald Green
        'tech-02': "#1e3a8a",     # Deep Navy
        'tech-03': "#7c3aed",     # Purple
        'tech-04': "#0284c7",     # Sky Blue
        'tech-05': "#0d9488",     # Teal
        'health-01': "#0284c7",   # Blue
        'health-02': "#059669",   # Green
        'admin-01': "#b45309",    # Amber
        'admin-02': "#475569",    # Slate
        'sales-01': "#b45309",    # Amber
        'finance-01': "#1e3a8a",  # Deep Navy
        'grad-01': "#059669"      # Emerald
    }
    heading_hex = color_map.get(template_style, "#059669")

    # Auto-detect layout type if not explicitly passed
    if not layout_type:
        if any(k in template_style for k in ['tech-01', 'tech-05', 'health-02', 'sales-01', 'split']):
            layout_type = 'split'
        elif any(k in template_style for k in ['tech-03', 'health-01', 'admin-02', 'corporate']):
            layout_type = 'corporate'
        elif any(k in template_style for k in ['tech-02', 'finance-01', 'tech']):
            layout_type = 'tech'
        else:
            layout_type = 'minimal'

    elements = []

    # ================= LAYOUT 1: SPLIT 2-COLUMN SIDEBAR PDF =================
    if layout_type == 'split':
        left_elements = []
        left_name_style = ParagraphStyle('LeftName', parent=styles['Heading1'], fontSize=15, leading=18, textColor=colors.white, spaceAfter=6)
        left_text_style = ParagraphStyle('LeftText', parent=styles['Normal'], fontSize=8.5, leading=12, textColor=colors.HexColor("#f1f5f9"), spaceAfter=3)
        left_heading_style = ParagraphStyle('LeftHeading', parent=styles['Heading2'], fontSize=10, leading=13, textColor=colors.white, spaceBefore=10, spaceAfter=4)

        left_elements.append(Paragraph(f"<b>{data.get('full_name', 'CANDIDATE NAME').upper()}</b>", left_name_style))
        if data.get('email'): left_elements.append(Paragraph(f"• {data['email']}", left_text_style))
        if data.get('phone'): left_elements.append(Paragraph(f"• {data['phone']}", left_text_style))
        if data.get('location'): left_elements.append(Paragraph(f"• {data['location']}", left_text_style))
        if data.get('linkedin'): left_elements.append(Paragraph(f"• {data['linkedin']}", left_text_style))
        
        if data.get('skills'):
            left_elements.append(Spacer(1, 10))
            left_elements.append(Paragraph("<b>CORE SKILLS</b>", left_heading_style))
            skills_str = data['skills'] if isinstance(data['skills'], str) else ", ".join(data['skills'])
            left_elements.append(Paragraph(skills_str, left_text_style))

        if data.get('educations'):
            left_elements.append(Spacer(1, 10))
            left_elements.append(Paragraph("<b>EDUCATION</b>", left_heading_style))
            for edu in data['educations']:
                left_elements.append(Paragraph(f"<b>{edu.get('degree', '')}</b>", left_text_style))
                left_elements.append(Paragraph(f"{edu.get('institution', '')} ({edu.get('year', '')})", left_text_style))
                left_elements.append(Spacer(1, 2))

        right_elements = []
        right_heading = ParagraphStyle('RightHeading', parent=styles['Heading2'], fontSize=11, leading=14, textColor=colors.HexColor(heading_hex), spaceBefore=8, spaceAfter=4)
        right_item = ParagraphStyle('RightItem', parent=styles['Normal'], fontSize=9.5, leading=12, textColor=colors.HexColor("#0f172a"), spaceAfter=2)
        right_body = ParagraphStyle('RightBody', parent=styles['Normal'], fontSize=8.5, leading=12, textColor=colors.HexColor("#334155"), spaceAfter=4)

        if data.get('summary'):
            right_elements.append(Paragraph("<b>PROFESSIONAL SUMMARY</b>", right_heading))
            right_elements.append(Paragraph(data['summary'], right_body))
            right_elements.append(Spacer(1, 4))

        experiences = data.get('experiences', [])
        if experiences:
            right_elements.append(Paragraph("<b>PROFESSIONAL EXPERIENCE</b>", right_heading))
            for exp in experiences:
                t_line = f"<b>{exp.get('jobTitle', '')}</b> — {exp.get('company', '')} <font color='#64748b'>({exp.get('duration', '')})</font>"
                right_elements.append(Paragraph(t_line, right_item))
                if exp.get('responsibilities'):
                    for b in exp['responsibilities'].split('\n'):
                        if b.strip():
                            right_elements.append(Paragraph(f"• {b.strip().lstrip('•- ')}", right_body))
                right_elements.append(Spacer(1, 4))

        projects = data.get('projects', [])
        if projects:
            right_elements.append(Paragraph("<b>KEY PROJECTS</b>", right_heading))
            for proj in projects:
                p_line = f"<b>{proj.get('projectName', '')}</b> <font color='#64748b'>({proj.get('technologies', '')})</font>"
                right_elements.append(Paragraph(p_line, right_item))
                if proj.get('description'):
                    right_elements.append(Paragraph(proj['description'], right_body))
                right_elements.append(Spacer(1, 4))

        if data.get('certifications'):
            right_elements.append(Paragraph("<b>CERTIFICATIONS & DETAILS</b>", right_heading))
            right_elements.append(Paragraph(data['certifications'], right_body))

        table = Table([[left_elements, right_elements]], colWidths=[180, 372])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor(heading_hex)),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (0,0), 12),
            ('RIGHTPADDING', (0,0), (0,0), 12),
            ('TOPPADDING', (0,0), (0,0), 12),
            ('BOTTOMPADDING', (0,0), (0,0), 12),
            ('LEFTPADDING', (1,0), (1,0), 14),
            ('RIGHTPADDING', (1,0), (1,0), 10),
            ('TOPPADDING', (1,0), (1,0), 10),
            ('BOTTOMPADDING', (1,0), (1,0), 10),
        ]))
        elements.append(table)

    # ================= LAYOUT 2: MINIMAL / CORPORATE / TECH 1-COLUMN PDF =================
    else:
        name_style = ParagraphStyle('ATS_Name', parent=styles['Heading1'], fontSize=20, leading=24, textColor=colors.HexColor("#0f172a"), spaceAfter=4, alignment=1)
        contact_style = ParagraphStyle('ATS_Contact', parent=styles['Normal'], fontSize=9, leading=12, textColor=colors.HexColor("#475569"), spaceAfter=12, alignment=1)
        sec_heading = ParagraphStyle('ATS_SecHeading', parent=styles['Heading2'], fontSize=12, leading=15, textColor=colors.HexColor(heading_hex), spaceBefore=10, spaceAfter=4)
        item_title = ParagraphStyle('ATS_ItemTitle', parent=styles['Normal'], fontSize=10, leading=13, textColor=colors.HexColor("#0f172a"), spaceAfter=2)
        body_style = ParagraphStyle('ATS_Body', parent=styles['Normal'], fontSize=9, leading=13, textColor=colors.HexColor("#334155"), spaceAfter=4)

        elements.append(Paragraph(f"<b>{data.get('full_name', 'CANDIDATE NAME').upper()}</b>", name_style))
        contact_parts = []
        if data.get('email'): contact_parts.append(data['email'])
        if data.get('phone'): contact_parts.append(data['phone'])
        if data.get('location'): contact_parts.append(data['location'])
        if data.get('linkedin'): contact_parts.append(data['linkedin'])
        elements.append(Paragraph(" | ".join(contact_parts), contact_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0"), spaceBefore=2, spaceAfter=8))

        if data.get('summary'):
            elements.append(Paragraph("<b>PROFESSIONAL SUMMARY</b>", sec_heading))
            elements.append(Paragraph(data['summary'], body_style))
            elements.append(Spacer(1, 6))

        if data.get('skills'):
            elements.append(Paragraph("<b>CORE COMPETENCIES & SKILLS</b>", sec_heading))
            skills_text = data['skills'] if isinstance(data['skills'], str) else ", ".join(data['skills'])
            elements.append(Paragraph(skills_text, body_style))
            elements.append(Spacer(1, 6))

        experiences = data.get('experiences', [])
        if experiences:
            elements.append(Paragraph("<b>PROFESSIONAL EXPERIENCE</b>", sec_heading))
            for exp in experiences:
                title_line = f"<b>{exp.get('jobTitle', '')}</b>"
                if exp.get('company'): title_line += f" — <i>{exp.get('company')}</i>"
                if exp.get('duration'): title_line += f" <font color='#64748b'>({exp.get('duration')})</font>"
                elements.append(Paragraph(title_line, item_title))
                if exp.get('responsibilities'):
                    for bullet in exp['responsibilities'].split('\n'):
                        if bullet.strip():
                            b_text = bullet.strip().lstrip('•- ')
                            elements.append(Paragraph(f"• {b_text}", body_style))
                elements.append(Spacer(1, 4))

        projects = data.get('projects', [])
        if projects:
            elements.append(Paragraph("<b>KEY PROJECTS</b>", sec_heading))
            for proj in projects:
                p_line = f"<b>{proj.get('projectName', '')}</b>"
                if proj.get('technologies'): p_line += f" <i>(Tools: {proj.get('technologies')})</i>"
                elements.append(Paragraph(p_line, item_title))
                if proj.get('description'):
                    elements.append(Paragraph(proj['description'], body_style))
                elements.append(Spacer(1, 4))

        educations = data.get('educations', [])
        if educations:
            elements.append(Paragraph("<b>EDUCATION</b>", sec_heading))
            for edu in educations:
                e_line = f"<b>{edu.get('degree', '')}</b> — {edu.get('institution', '')}"
                if edu.get('year'): e_line += f" ({edu.get('year')})"
                elements.append(Paragraph(e_line, body_style))
            elements.append(Spacer(1, 6))

        if data.get('certifications'):
            elements.append(Paragraph("<b>CERTIFICATIONS & ADDITIONAL DETAILS</b>", sec_heading))
            elements.append(Paragraph(data['certifications'], body_style))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
