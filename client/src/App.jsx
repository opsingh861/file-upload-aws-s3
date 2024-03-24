import { useState } from 'react'
import axios from 'axios'

function App() {

  const [file, setFile] = useState(null);

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={async () => {
        const { data } = await axios.post('http://localhost:3000/upload', { key: file.name });
        console.log(data);
        await axios.put(data.uploadURL, file);
        alert('File uploaded');
      }
      }>Upload</button>

      <button onClick={async () => {
        const { data } = await axios.get('http://localhost:3000/download', { params: { key: file.name } });
        console.log(data);
        window.open(data.downloadURL);
        // direct download
      }}>Download</button>
    </>
  )
}

export default App
