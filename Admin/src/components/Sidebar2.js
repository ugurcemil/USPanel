import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect, withRouter, useParams,useRouteMatch} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import doAjax from '../libraries/doAjax';
import tokenCheck from '../libraries/tokenCheck';

import AppContext from '../context/AppContext';
import SidebarLogo from '../assets/img/logo-w.png';

function isInArray(array, search)
{
    return array.indexOf(search) >= 0;
}


const SidebarListe = (props) => {
  if (!props.listArr) {
    return false;
  }
  if(props.selectedSidebar){
    /*console.log("ayarla")
    console.log(props.selectedSidebar)
    console.log(props.listArr)
    console.log(props.activeTabArr)*/
  }
  
  const linkOnClick = (value, order) => {
    //console.log(props.order)
    if(order <= props.activeOrder ){   // esit seviyede ise
      let newArr = [...props.activeTabArr];
      let aIndex = newArr.find(index => index == parseInt(value.id))
      if(newArr.indexOf(aIndex) != -1){   // Aynı satırın alt sayfaları seçilirse arrayı bir arttır
        newArr.length = newArr.indexOf(aIndex)+1;
        props.setActiveTabArr(newArr);
      }
      if(newArr.indexOf(aIndex) == -1){   // Başka bir satır seçilirse arrayı seçilen seviyeye kadar azalt
        newArr.length = order - 1;
        newArr.push(parseInt(value.id))
        props.setActiveTabArr(newArr);
      }
      props.setActiveOrder(order);
    }
    if(order > props.activeOrder ){   // alt seviye ise arrayı 0dan oluştur
      const newArr = [...props.activeTabArr];
      newArr.push(parseInt(value.id));
      props.setActiveTabArr(newArr);
      props.setActiveOrder(order); 
    }
  }
  return (
    <div className="smenu">
      {(props.listArr?<ul>    
        {props.listArr.map((value, key) => {
          
          let link = '';
          //let link = '/CrudList/' + value.slug;
          //console.log(value)
          if(value.hasTable == 1){
            link = '/CrudList/' + value.slug;
          }
          if(value.componentName){
            link = '/' + value.componentName;
          }
          
          //console.log(props.activeTabArr);
          //console.log(props.activeOrder);
          
          return (
            <CSSTransition in={(isInArray(props.activeTabArr, parseInt(value.id)) )} key={value.id} timeout={500} classNames="selected" >
              <li className={((isInArray(props.activeTabArr, parseInt(value.id))   )? 'selected-enter-done' : '') + " listType" + value.list_type}>
                <Link to={link} onClick={(e) => linkOnClick(value, props.order)} >
                  {(value.icon?<div className="icon"><i className={value.icon}></i></div>:'')}
                  <span>{value.title}</span>
                  {(value.children?<div className="arrow"><i className="fa fa-caret-down"></i></div>:null)}
                </Link>
                <SidebarListe listArr={value.children} activeTabArr={props.activeTabArr} setActiveTabArr={props.setActiveTabArr} order={props.order + 1} activeOrder={props.activeOrder} setActiveOrder={props.setActiveOrder} />
              </li>
            </CSSTransition>
          )
        })}
      </ul>: '' )}
    </div>
  )
}
const Sidebar = props => {
  const appContext = useContext(AppContext);
  const [activeTabArr, setActiveTabArr] = useState([2]);
  const [activeOrder, setActiveOrder] = useState(1);
  

  useEffect(() => {
  }, [appContext.sidebarData])
  useEffect(() => {
    tokenCheck({appContext});
    
    const data = doAjax(
      appContext.api_url + 'ApiAdmin/loadSidebars','GET',{}
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      //console.log(gelen)
      appContext.setSidebarData(gelen);
    })
    

  }, [])  
  
  return(
    <div className="sidebar">
      <div className="logo-cont">
        <Link to="/"><img src={SidebarLogo} 
          alt="UğurSoft Yönetim Paneli" /></Link>
      </div>
      <div className="sb-list">  
        <SidebarListe listArr={appContext.sidebarData} activeTabArr={activeTabArr} setActiveTabArr={setActiveTabArr} order={1} activeOrder={activeOrder} setActiveOrder={setActiveOrder} selectedSidebar={appContext.selectedSidebar} />
      </div>
      <div className="btn-add-panel">
        <Link to="/Panel">Panel Ekle</Link>
        <Link to="/Language">Dil Ekle</Link>
      </div>
    </div>
  )
}
export default withRouter(Sidebar);
