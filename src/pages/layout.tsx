import HomeLayoutAnimation from "components/AnimationLayout/home-layout-animation";
import { Outlet } from "react-router-dom";

function Layout({ children }: any) {
  return (
    <div className="relative antialiased text-slate-500 dark:text-slate-400 bg-[#fafafa] dark:bg-slate-900">
      <div className="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="w-[108rem] flex-none flex justify-end">
          <picture>
            <source srcSet="/bg/shapeA.avif" type="image/avif" />
            <img
              src="/bg/shapeB.avif"
              alt=""
              className="w-[71.75rem] flex-none max-w-none dark:hidden"
              decoding="async"
            />
          </picture>

          <picture>
            <source srcSet="/bg/a-bg.avif" type="image/avif" />
            <img
              src="/bg/b-bg.png"
              alt=""
              className="w-[90rem] flex-none max-w-none hidden dark:block"
              decoding="async"
            />
          </picture>
        </div>
      </div>

      <div className="backdrop-blur ">
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;
