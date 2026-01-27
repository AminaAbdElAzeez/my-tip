import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const HomeLayoutAnimation = ({children}:{children:any}) => {
    const { pathname } = useLocation();
    console.log(pathname.split("/"))
    return (
        <motion.div
          key={pathname.split("/")[1]}
          
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
         {children}
        </motion.div>
    );
  };

  export default HomeLayoutAnimation