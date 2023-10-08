import { useSelector } from 'react-redux';
import { Outlet , Navigate} from 'react-router-dom';
const PrivateRouter = () => {
    const { currentUser } = useSelector((state: any) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRouter