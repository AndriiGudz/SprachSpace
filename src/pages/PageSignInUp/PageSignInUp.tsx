import SignInUp from "../../components/SignInUp/SignInUp";
import SignInUpMob from "../../components/SignInUpMob/SignInUpMob";
import { useMediaQuery } from "@mui/material";

function PageSignInUp() {
  // Проверяем, меньше ли ширина экрана 900px
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <div>
      {isMobile ? <SignInUpMob /> : <SignInUp />}
    </div>
  );
}

export default PageSignInUp;
