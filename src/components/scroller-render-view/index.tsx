import Scrollbars from 'react-custom-scrollbars-2'
import { useSelector } from 'react-redux';
function ScrollerRenderView({children , ...rest}:any) {
    const {locale} = useSelector(({LanguageSwitcher}:{LanguageSwitcher:ILanguageSwitcher}) => LanguageSwitcher.language);

  return (
    <Scrollbars
 {...rest}
 renderView={(el)=><div  style={{
    ...el.style,
    marginInlineEnd:el.style.marginRight,
    marginRight:'unset'
  }}></div>}
//   renderThumbVertical={(el) => {
// console.log({el})
//     return <div style={{...el.stle , backgroundColor:'red'}}  />
//   }}

      renderTrackVertical={(el) => {
        return <div style={{...el.style , 
        [locale==='ar' ?'left':'right']: '2px',
        bottom: '2px',
        top: '2px',
        borderRadius: '3px',
    }}  />
    }}
 
    >{children}</Scrollbars>
    
  )
}

export default ScrollerRenderView