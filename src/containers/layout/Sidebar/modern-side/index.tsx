import SubSide from './sub'
import MainSide from './main'
import { Transition, motion } from 'framer-motion'
// import useSwiper from 'utlis/library/hooks/useSwiper'
const SIDE_WIDTH = {
  main:64,
  sub:320
}
const COLLAPSE_TRANSITION:Transition={
  duration:.4,
  type:"spring",
  stiffness:80
}
const variantsSideContainer =(collapsed)=> ({
  initial:{
    width:SIDE_WIDTH.main
  },
  animate:{
    width:collapsed?SIDE_WIDTH.sub:SIDE_WIDTH.main,
    transition:COLLAPSE_TRANSITION
  }
})

const variantsSubSide =(collapsed )=> {
 const WIDTH_TO_SHOW=SIDE_WIDTH.sub;
 const x =collapsed?0:`${-WIDTH_TO_SHOW}px`
return { 
  initial:{
    marginInlineStart:x,
  },
  animate:{
    marginInlineStart:x,
    transition:COLLAPSE_TRANSITION
  }}
}
function Sider({collapsed  , setCollapsed}) {
  return (<>
    <motion.div
    variants={variantsSideContainer(collapsed)}
    initial="initial"
    animate="animate"
    className={`side-container flex flex-shrink-0 -ms-16 sm:ms-0 fixed sm:static z-20 `}>
    <SubSide  collapsed={collapsed} variantsSubSide={variantsSubSide(collapsed )} width={SIDE_WIDTH}  />
     <MainSide width={SIDE_WIDTH} setCollapsed={setCollapsed} collapsed={collapsed} />
     <div onClick={()=>{setCollapsed(false)}}  className={`fixed inset-0 bg-[#000000bb] -z-10 ${!collapsed?"hidden":""} sm:hidden `}></div>
       </motion.div>
  </>
 
  )
}

export default Sider