import Header from "./Layout/Header/Header";
import Footer from "./Layout/Footer/Footer";
import './Layout/Header/Header.module.css';
import {Outlet} from 'react-router-dom'


export function Layout({ children }) {
    return (
        
        <div>
            <Header />  
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

