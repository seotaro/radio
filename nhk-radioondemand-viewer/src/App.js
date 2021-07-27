
import React, { useState, useEffect, Fragment } from 'react';
import List from './Component/List';
import Detail from './Component/Detail';

const URL = `https://www.nhk.or.jp/radioondemand/json/index_v3/index.json`;

function App() {

  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [detailUrl, setDetailUrl] = useState(null);
  const [isOpenDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const items = await fetch(URL)
        .then(response => {
          const lastModified = response.headers.get('Last-Modified');
          return response.text();
        })
        .then(text => {
          return JSON.parse(text);
        })
        .then(index => {
          return index.data_list.map((x, i) => {
            return { ...x, media_codes: x.media_code.split(','), id: i }     // DataGrid で扱うのに ID を付加してやる。
          });
        })
        .catch((error) => {
          console.error(error)
        })

      setItems(items);

      setLoading(false);
    })();
  }, []);

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
      <List items={items} isLoading={isLoading} onRowClick={onRowClick} />
      <Detail isOpen={isOpenDetail} url={detailUrl} onClose={onCloseDetail} />
    </Fragment>
  );
}

export default App;
