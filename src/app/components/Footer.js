import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div>© 2024 يسلمو - جميع الحقوق محفوظة</div>
            <div className="footer-links">
                <Link href="/terms">الشروط والأحكام</Link>
                <span className="footer-divider">|</span>
                <Link href="/privacy">سياسة الخصوصية</Link>
            </div>
        </footer>
    );
}
