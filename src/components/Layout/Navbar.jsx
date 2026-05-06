import "./Navbar.css";
import profile_person_girl from "../../assets/profile_person_girl.png";
import { Link } from "react-router";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="nav-left">
                <div className="brand">
                    <div className="brand-icon">🏢</div>
                    <div className="brand-text">
                        <h1>Real Estate Platform</h1>
                        <p>منصة عقارية تفاعلية</p>
                    </div>
                </div>
            </div>

            <nav className="nav-center">
                <a className="nav-item" href="#home">الرئيسية</a>
                <a className="nav-item" href="#services-section">الخدمات</a>
                <Link className="nav-item" to="dashboard">لوحة التحكم</Link>
                <a className="nav-item" href="#faq">الأسئلة الشائعة</a>
                <a className="nav-item" href="#contact">تواصل معنا</a>
            </nav>

            <div className="nav-right">
                <div className="user-profile">
                    <img
                        className="user-avatar"
                        src={profile_person_girl}
                        alt="Asmaa Abdelnaser"
                    />
                    <div className="user-info">
                        <span className="user-name">أسماء عبد الناصر</span>
                        <span className="user-role">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
