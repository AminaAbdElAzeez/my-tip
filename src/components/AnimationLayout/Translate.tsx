import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const childVariants = {
  initial: {
    opacity: 0,
    y: "50px",
  },
  final: {
    opacity: 1,
    y: "0px",
    transition: {
      duration: 0.5,
      delay: 0.5,
    },
  },
};
const TranslateLayoutAnimation = ({children}:{children:any}) => {
    const { pathname } = useLocation();
    return (
        <motion.div
          key={pathname}
          
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
         {children}
        </motion.div>
    );
  };

  export default TranslateLayoutAnimation









  