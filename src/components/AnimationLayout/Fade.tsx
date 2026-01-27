import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "linear",
    duration: 0.5
  };
const FadeLayoutAnimation = ({children}:{children:any}) => {
    const { pathname } = useLocation();
    return (
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          variants={pageVariants}
          transition={pageTransition}
   
        >
         {children}
        </motion.div>
    );
  };

  export default FadeLayoutAnimation