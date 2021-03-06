import React, {useState, useContext, useEffect} from 'react';
import Select from '../../../components/form/Select'

export default function RowInputSelect (
  {values, label, slug, onChange, inputList,itemKeyValue, itemKeyName, hasDefault, defaultValue}
  ){
  //console.log(values)
  return(
    <div className="frow">
      <div className="flabel">
        {label}
      </div>
      <div className="fval">
        <div className="input-text">
          <Select name={slug} value={values.panel_table_column_input_id} onChange={onChange} 
            inputList={inputList} itemKeyValue={itemKeyValue} itemKeyName={itemKeyName}
            hasDefault={hasDefault} defaultValue={defaultValue} />
        </div>              
      </div>
    </div>
  )
}

//  itemKeyName="title" hasDefault={1}