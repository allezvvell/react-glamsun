import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export class Authentication {
  constructor(app) {
    this.app = app;
    this.auth = getAuth(this.app);
    this.ADMIN_UID = 'gwhKByww2fZF5zBe27FqWZcwKED3';
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account', // 계정 선택 화면 강제 표시
    });
  }

  handleGoogleSignIn = () =>
    signInWithPopup(this.auth, this.provider).catch((error) => {
      console.log('로그인에러', error);
    });

  handleSignOut = () =>
    signOut(this.auth).catch((error) => {
      console.log('로그아웃에러', error);
    });

  addAuthListener = (setUser, setLoading) => {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        setUser({ displayName, photoURL, uid });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  };
}
