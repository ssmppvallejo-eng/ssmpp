
import { StyleProvider } from "../../providers/StyleProvider";
import LayoutContent from "../../components/app/LayoutContent";


export default function AppLayout({ children }) {
    return (
        <StyleProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </StyleProvider>
    );
}
