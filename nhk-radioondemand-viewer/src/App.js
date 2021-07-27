
import React, { useState, Fragment } from 'react';
import List from './Component/List';
import Detail from './Component/Detail';

function App() {

  const [detailUrl, setDetailUrl] = useState(null);
  const [isOpenDetail, setOpenDetail] = useState(false);

  const onRowClick = (param) => {
    setDetailUrl(param.row.detail_json);
    setOpenDetail(true);
  };

  const onCloseDetail = () => {
    setDetailUrl(null);
    setOpenDetail(false);
  };

  return (
    <Fragment>
      <List onRowClick={onRowClick} />
      <Detail isOpen={isOpenDetail} url={detailUrl} onClose={onCloseDetail} />
    </Fragment>
  );
}

export default App;
