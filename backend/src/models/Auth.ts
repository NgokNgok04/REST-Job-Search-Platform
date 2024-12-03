import Cookies from "js-cookie";
class Auth {
  // aduh ngga bisa ini, ga tau kenapa
  static async isLogin() {
    if (Cookies.get("authToken")) return true;
    return false;
  }
}

export default Auth;
