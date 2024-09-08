import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';

export class Database {
  constructor(app, userData, userHistory) {
    this.app = app;
    this.db = getDatabase(this.app);
    this.userData = userData;
    this.userHistory = userHistory;
  }

  #updateWish = async (newWish) => {
    const wishRef = ref(this.db, `users/${this.userData.uid}/wish`);
    await set(wishRef, newWish);
  };

  toggleWish = async (productId) => {
    let newWish = [...(this.userHistory?.wish || [])];

    if (newWish.includes(productId)) {
      newWish = newWish.filter((id) => id !== productId);
    } else {
      newWish.push(productId);
    }

    await this.#updateWish(newWish);
  };

  sendGuestWish = async (guestWish, setGuestWish) => {
    if (this.userData && guestWish?.length > 0) {
      let newWish = [...this.userHistory?.wish, ...guestWish];
      newWish = newWish.filter((el, idx) => newWish.indexOf(el) === idx); // 중복제거

      await this.#updateWish(newWish);

      setGuestWish(null);
    }
  };

  #updateCart = async (newCartObj) => {
    const cartRef = ref(this.db, `users/${this.userData.uid}/cart`);
    await set(cartRef, newCartObj);
  };

  addToCart = async (product, option) => {
    const { imgUrl, price, productId, title } = product;
    const key = option ? productId + option : productId;
    let newUserCart = this.userHistory?.cart
      ? { ...this.userHistory.cart }
      : {};

    if (newUserCart[key]) {
      //기존에 같은 상품이 있는 경우
      newUserCart[key].qty += 1;
    } else {
      //같은 상품이 없는 경우
      newUserCart[key] = {
        productId,
        title,
        price,
        qty: 1,
        imgUrl,
        updatedAt: new Date().toISOString(),
        ...(option && { option }),
      };
    }
    await this.#updateCart(newUserCart);
  };

  subtractFromCart = async (key) => {
    const newQty = this.userHistory.cart[key].qty - 1;
    if (newQty === 0) return; // 현재 수량이 1이면 작동하지 않게
    const newUserCart = { ...this.userHistory.cart };
    newUserCart[key].qty = newQty;
    await this.#updateCart(newUserCart);
  };

  removeFromCart = async (key) => {
    const newUserCart = { ...this.userHistory.cart };
    delete newUserCart[key];
    await this.#updateCart(newUserCart);
  };

  writeProduct = async (imgUrl, productData) => {
    const productRef = push(ref(this.db, 'products'));
    await set(productRef, {
      ...productData,
      imgUrl,
      productId: productRef.key,
      updatedAt: new Date().toISOString(),
    });
  };

  readProduct = async (productId) => {
    const snapshot = await get(child(ref(this.db), `products/${productId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('상품 데이터가 존재하지 않습니다');
    }
  };

  readProductsByCategory = async (category) => {
    const productRef = ref(this.db, 'products');
    const categoryQuery = !category
      ? productRef
      : query(productRef, orderByChild(`category/${category}`), equalTo(true));
    const snapshot = await get(categoryQuery);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      throw new Error('상품 데이터가 존재하지 않습니다');
    }
  };

  addUserListener = (setUser) => {
    return onValue(
      ref(this.db, `users/${this.userData?.uid}`),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUser(data);
        } else {
          setUser({});
        }
      },
      (error) => {
        console.log('users 읽어오는중 에러', error.message);
        if (!this.userData) setUser({});
      }
    );
  };

  addProductsListener = (category, queryClient) => {
    const productRef = ref(this.db, 'products');
    const categoryQuery = !category
      ? productRef
      : query(productRef, orderByChild(`category/${category}`), equalTo(true));
    return onValue(
      categoryQuery,
      (snapshot) => {
        const newData = Object.values(snapshot.val());
        queryClient.setQueryData(['products', category], newData);
      },
      (error) => {
        console.log('products 관찰자 에러', error.message);
      }
    );
  };
}
