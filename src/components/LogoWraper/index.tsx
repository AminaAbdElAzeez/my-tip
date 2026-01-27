import { Divider } from 'antd'

function LogoWraper({children}) {
  return (<>
 
    <div
    className="demo-logo-vertical flex-row-reverse  h-[64px] flex "
  >
    <Divider style={{
      height:'calc(100% + .05rem)'
    }} type='vertical' className='m-0'  />
<div className='flex justify-center items-center w-full'>
   {children}
</div>
  </div>
  <Divider className='m-0'  />
  </>
  )
}

export default LogoWraper