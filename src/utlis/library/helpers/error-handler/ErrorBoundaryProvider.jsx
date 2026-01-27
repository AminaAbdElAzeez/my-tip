import ErrorBoundaryInner from "./ErrorBoundaryInner";
import {  useState } from "react";

export default function ErrorBoundaryProvider({children ,fallBackUIComponent}) {
    const [hasError, setHasError] = useState(false);
    // const location = useLocation();
    // useEffect(() => {
    //   if (hasError) {
    //     setHasError(false);
    //   }
    // }, [location.key]);
    return (
      <ErrorBoundaryInner
      fallBackUIComponent={fallBackUIComponent}
        hasError={hasError} 
        setHasError={setHasError}
      >
        {children}
      </ErrorBoundaryInner>
    );
  }