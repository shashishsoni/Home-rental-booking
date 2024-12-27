import Navbar from '@/components/Navbar';
import Slide from '@/components/slide';
import Categories from '@/components/Categories';
import Listings from '../components/listings';
import Footer from '../components/Footer';

const HomePage = () => {
  // const userState = useSelector((state: any) => state.user);
  
  return (
    <div>
      <Navbar />
      <Slide />
      <Categories />
      <Listings />
      <Footer />
    </div>
  );
};

export default HomePage;