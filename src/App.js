import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cart from './pages/Cart/Cart';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Layout from './layout/Layout';
import Products from './pages/Products';
import Search from './pages/Search';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Products /> },
      {
        path: 'products',
        children: [
          { path: 'category/:categoryName', element: <Products /> },
          { path: 'search/:keyword', element: <Search /> },
          { path: 'product/:productId', element: <ProductDetail /> },
        ],
      },
      { path: '/cart', element: <Cart /> },
      { path: '/admin', element: <Admin /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
