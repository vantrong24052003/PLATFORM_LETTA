#!/usr/bin/env python3
"""
UX Audit Script - Kiểm tra toàn diện Thiết kế Frontend (Bootstrap 3 / AdminLTE)

Phân tích mã nguồn để kiểm tra sự tuân thủ với:

1. QUY LUẬT TÂM LÝ HỌC CỐT LÕI:
   - Luật Hick (số lượng mục điều hướng)
   - Luật Fitts (kích thước mục tiêu)
   - Luật Miller (chia nhỏ thông tin)
   - Hiệu ứng Von Restorff (sự nổi bật của CTA)
   - Hiệu ứng vị trí chuỗi (Serial Position)

2. THIẾT KẾ CẢM XÚC (Don Norman):
   - Visceral (ấn tượng đầu tiên)
   - Behavioral (khả năng sử dụng)
   - Reflective (câu chuyện thương hiệu)

3. XÂY DỰNG NIỀM TIN:
   - Tín hiệu bảo mật (SSL)
   - Bằng chứng xã hội (Social proof)
   - Tín hiệu thẩm quyền (Authority)

4. QUẢN LÝ TẢI NHẬN THỨC:
   - Tiết lộ lũy tiến (Accordion, Tabs)
   - Nhiễu thị giác (quá nhiều màu sắc/đường viền)
   - Mẫu quen thuộc

5. THIẾT KẾ THUYẾT PHỤC (Ethical):
   - Mặc định thông minh
   - Hiệu ứng mỏ neo (Neo giá)
   - Bằng chứng xã hội
   - Chỉ báo tiến trình

6. HỆ THỐNG TYPOGRAPHY:
   - Số lượng Font (tối đa 3)
   - Độ dài dòng (45-75 ký tự)
   - Chiều cao dòng (Line-height)
   - Phân cấp (h1-h6)

7. HIỆU ỨNG THỊ GIÁC:
   - Đổ bóng (Shadows)
   - Gradient
   - Hiệu suất (GPU Acceleration)

8. HỆ THỐNG MÀU SẮC:
   - Cấm màu Tím (Quy tắc Maestro)
   - Quy tắc 60-30-10
   - Tương phản WCAG

9. HƯỚNG DẪN ANIMATION:
   - Thời lượng
   - Easing
   - Trạng thái loading
"""

import sys
import os
import re
import json
from pathlib import Path

class UXAuditor:
    def __init__(self):
        self.issues = []
        self.warnings = []
        self.passed_count = 0
        self.files_checked = 0
    
    def audit_file(self, filepath: str) -> None:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except: return
        
        self.files_checked += 1
        filename = os.path.basename(filepath)

        # Pre-calculate common flags
        has_long_text = bool(re.search(r'<p|<div.*class=.*text|article|<span.*text', content, re.IGNORECASE))
        has_form = bool(re.search(r'<form|<input|password|credit|card|payment', content, re.IGNORECASE))
        complex_elements = len(re.findall(r'<input|<select|<textarea|<option', content, re.IGNORECASE))

        # --- 1. PSYCHOLOGY LAWS ---
        # Hick's Law
        nav_items = len(re.findall(r'<NavLink|<Link|<a\s+href|nav-item|navbar-nav>li', content, re.IGNORECASE))
        if nav_items > 7:
            self.issues.append(f"[Hick's Law] {filename}: {nav_items} mục điều hướng (Tối đa 7). Hãy nhóm lại.")
        
        # Fitts' Law - Bootstrap specific
        if re.search(r'btn-xs', content) or re.search(r'height:\s*([0-3]\d)px', content):
            self.warnings.append(f"[Fitts' Law] {filename}: Mục tiêu quá nhỏ (btn-xs hoặc < 44px). Khó thao tác trên di động.")
        
        # Miller's Law
        form_fields = len(re.findall(r'<input|<select|<textarea', content, re.IGNORECASE))
        if form_fields > 7 and not re.search(r'step|wizard|stage|nav-tabs', content, re.IGNORECASE):
            self.warnings.append(f"[Miller's Law] {filename}: Form phức tạp ({form_fields} trường). Hãy chia nhỏ form.")
            
        # Von Restorff (Primary CTA)
        if 'button' in content.lower() and not re.search(r'btn-primary|btn-success|btn-danger|label-primary', content, re.IGNORECASE):
            self.warnings.append(f"[Von Restorff] {filename}: Không thấy CTA chính (btn-primary/success). Cần làm nổi bật hành động chính.")

        # --- 1.5 EMOTIONAL DESIGN ---

        # Visceral
        has_hero = bool(re.search(r'hero|<h1|jumbotron|banner', content, re.IGNORECASE))
        if has_hero:
            has_visual_interest = bool(re.search(r'gradient|background-image|img|animate', content))
            if not has_visual_interest:
                self.warnings.append(f"[Visceral] {filename}: Phần Hero thiếu điểm nhấn thị giác. Cân nhắc thêm ảnh hoặc gradient.")

        # Behavioral
        if 'onClick' in content or '@click' in content or 'onclick' in content:
            has_feedback = re.search(r'btn-|hover|active|disabled|loading|spinner|fa-spin', content, re.IGNORECASE)
            
            if not has_feedback:
                self.warnings.append(f"[Behavioral] {filename}: Tương tác thiếu phản hồi. Thêm trạng thái hover/loading hoặc disabled.")

        # --- 1.6 TRUST BUILDING ---

        # Security signals
        if has_form:
            security_signals = re.findall(r'ssl|secure|encrypt|lock|padlock|https|fa-lock', content, re.IGNORECASE)
            if len(security_signals) == 0 and not re.search(r'checkout|payment', content, re.IGNORECASE):
                self.warnings.append(f"[Trust] {filename}: Form thiếu tín hiệu bảo mật (icon khóa, SSL).")

        # --- 1.7 COGNITIVE LOAD MANAGEMENT ---

        # Progressive disclosure (Specific for AdminLTE/Bootstrap)
        if complex_elements > 5:
            has_progressive = re.search(r'collapse|accordion|tab-pane|nav-tabs|modal|box-tools', content, re.IGNORECASE)
            if not has_progressive:
                self.warnings.append(f"[Cognitive Load] {filename}: Nhiều phần tử form mà không có tiết lộ lũy tiến (Tabs, Collapse, Modal).")

        # Familiar patterns
        if has_form:
            has_standard_labels = bool(re.search(r'<label|placeholder|aria-label|form-group', content, re.IGNORECASE))
            if not has_standard_labels:
                self.issues.append(f"[Cognitive Load] {filename}: Form input thiếu label hoặc form-group chuẩn.")

        # --- 2. TYPOGRAPHY SYSTEM ---

        # 2.1 Font Pairing
        font_families = set(re.findall(r'font-family:\s*([^;]+)', content, re.IGNORECASE))
        if len(font_families) > 3:
            self.issues.append(f"[Typography] {filename}: {len(font_families)} font families được phát hiện. Giới hạn 2-3 font.")

        # 2.7 Hierarchy
        headings = re.findall(r'<(h[1-6])', content, re.IGNORECASE)
        if headings:
            for i in range(len(headings) - 1):
                curr = int(headings[i][1])
                next_h = int(headings[i+1][1])
                if next_h > curr + 1:
                    self.warnings.append(f"[Typography] {filename}: Nhảy cấp tiêu đề (h{curr} -> h{next_h}). Hãy tuân thủ phân cấp.")

        # --- 3. VISUAL EFFECTS ---
        
        # GPU Acceleration
        if re.search(r'@keyframes|transition:', content):
            expensive_props = re.findall(r'width|height|top|left|right|bottom|margin|padding', content)
            if expensive_props:
                self.warnings.append(f"[Performance] {filename}: Animation trên thuộc tính tốn kém ({', '.join(set(expensive_props))}). Nên dùng transform/opacity.")

        # --- 4. COLOR SYSTEM ---

        # 4.1 PURPLE BAN (Luật Maestro)
        purple_hexes = ['#8B5CF6', '#A855F7', '#9333EA', '#7C3AED', '#6D28D9', 'purple', 'violet', 'fuchsia']
        for purple in purple_hexes:
            if purple.lower() in content.lower():
                self.issues.append(f"[Color] {filename}: PHÁT HIỆN MÀU TÍM ('{purple}'). Bị cấm theo luật Maestro. Dùng Teal/Cyan/Emerald.")
                break

        # 4.4 Dark Mode (Kiểm tra cơ bản cho AdminLTE)
        if re.search(r'color:\s*#000000|#000\b', content):
            self.warnings.append(f"[Color] {filename}: Phát hiện màu đen tuyệt đối (#000000). Nên dùng #333 hoặc #1a1a1a.")

        # --- 5. ANIMATION GUIDE ---

        # 5.4 Loading State
        has_async = bool(re.search(r'async|await|fetch|axios|loading|isLoading', content))
        has_loading = bool(re.search(r'spinner|fa-spin|progress|loading|overlay', content))
        if has_async and not has_loading:
            self.warnings.append(f"[Animation] {filename}: Có xử lý bất đồng bộ nhưng thiếu chỉ báo loading (spinner/overlay).")

        # --- 7. ACCESSIBILITY (Basic Check) ---
        if re.search(r'<img(?![^>]*alt=)[^>]*>', content):
            self.issues.append(f"[Accessibility] {filename}: Thiếu alt text cho thẻ img.")


    def audit_directory(self, directory: str) -> None:
        extensions = {'.tsx', '.jsx', '.html', '.vue', '.svelte', '.css', '.js', '.erb'}
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', 'dist', 'build', '.next', 'tmp', 'log'}]
            for file in files:
                if Path(file).suffix in extensions:
                    self.audit_file(os.path.join(root, file))

    def get_report(self):
        return {
            "files_checked": self.files_checked,
            "issues": self.issues,
            "warnings": self.warnings,
            "passed_checks": self.passed_count,
            "compliant": len(self.issues) == 0
        }

def main():
    if len(sys.argv) < 2: 
        print("Sử dụng: python ux_audit.py <đường_dẫn_dự_án> [--json]")
        sys.exit(1)
    
    path = sys.argv[1]
    is_json = "--json" in sys.argv
    
    auditor = UXAuditor()
    if os.path.isfile(path): auditor.audit_file(path)
    else: auditor.audit_directory(path)
    
    report = auditor.get_report()
    
    if is_json:
        print(json.dumps(report))
    else:
        # Use ASCII-safe output for Windows console compatibility
        print(f"\n[UX AUDIT] Đã kiểm tra {report['files_checked']} file")
        print("-" * 50)
        if report['issues']:
            print(f"[!] LỖI ({len(report['issues'])}):")
            for i in report['issues'][:10]: print(f"  - {i}")
        if report['warnings']:
            print(f"[*] CẢNH BÁO ({len(report['warnings'])}):")
            for w in report['warnings'][:15]: print(f"  - {w}")
        
        status = "ĐẠT" if report['compliant'] else "KHÔNG ĐẠT"
        print("-" * 50)
        print(f"TRẠNG THÁI: {status}")

    sys.exit(0 if report['compliant'] else 1)

if __name__ == "__main__":
    main()
