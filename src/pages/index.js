import React, {Component} from 'react';
import skylink from 'skylink';
import ReactSearchBox from 'react-search-box';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../components/Layout';
import Gallery from '../components/Gallery';

/**
 * https://siasky.net/GAD8NUtPi8DcPUKzaoCkZ6NXphtuirH7tBl44FqwflWXnw
 * https://siasky.net/AAAshTX3kgBbpqHYh0v_k7CxSUeXOpiCntZEvcl_d3tSWQ
 * https://siasky.net/AAA-1TyBEM0nCIYo2mhhvNnwjeZ9c_ww9JN7X2wyCKdRqQ
 */

const TreeView = dynamic(import('deni-react-treeview'), {
  ssr: false
})
const FileViewer = dynamic(import('react-file-viewer'), {
  ssr: false
})
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace');
    await import("ace-builds/src-noconflict/theme-twilight");
    await import("ace-builds/src-noconflict/mode-javascript");
    await import("ace-builds/src-noconflict/mode-html");
    await import("ace-builds/src-noconflict/mode-java");
    await import("ace-builds/src-noconflict/mode-css");
    await import("ace-builds/src-noconflict/mode-scss");
    await import("ace-builds/src-noconflict/mode-php");
    await import("ace-builds/src-noconflict/mode-python");
    await import("ace-builds/src-noconflict/mode-haml");
    await import("ace-builds/src-noconflict/mode-markdown");
    await import("ace-builds/src-noconflict/mode-json");
    await import("ace-builds/src-noconflict/mode-text");
    return ace;
  },
  {
    // eslint-disable-next-line react/display-name
    ssr: false,
  },
);

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrlPath: 'https://siasky.dev/GAD8NUtPi8DcPUKzaoCkZ6NXphtuirH7tBl44FqwflWXnw',
      selectedItem: '',
      searchSkylink: '',
      data: [],
      dropDownData: [],
      editorData: '<p>Hello from Skylink Viewer v1.0.1!</p>',
      editorFileType: 'html',
      allowedFileTypes: ['javascript', 'css', 'java', 'html', 'scss', 'haml', 
      'php', 'markdown', 'md', 'js', 'json', 'log', 'text'],
      allowedMediaFiles: ['pdf', 'csv', 'xls', 'xlsx', 'docx', 'mp4', 'MP4', 'webm', 'mp3', 'MP3'],
      allowedImageTypes: ['png', 'PNG', 'jpeg', 'jpg', 'bmp', 'gif', 'svg'],
      viewerIsOpen: false,
      currImg: 0,
      aceEditorStyles: {
        height: '100%',
        width: '100%',
      },
      fileViewerStyle: {
        width: '100%'
      },
      container: {
        position: 'fixed',
        height: '100%',
        width: 'calc(100% - 310px)',
        marginLeft: '310px',
        marginTop: '40px',
      },
      headerStyle: {
        padding: '0px 0px',
        width: '100%',
        zIndex: 1
      },
      headerSpan: {
        fontSize: '20px',
        fontWeight: '600'
      },
      headerSearchBox: {
        marginLeft: '150px',
        width: '300px'
      },
      spanStyles: {
        position: 'fixed',
        height: 'calc(100% - 60px)',
        border: 0
      }
    };
  }

  addTextKey(data) {
    for (let item in data) {
        data['text'] = data.name
        data['id'] = uuidv4()
        if(item === 'type' && data[item] === 'file') data['isLeaf'] = true
        if(item === 'children') {
          for (let key in data.children) {
            this.addTextKey(data.children[key], uuidv4())
          }
        }
    }
  }

  getData() {
    console.log('Getting data........')
    skylink.explore(this.state.baseUrlPath).then(d => {
      // console.log(d)
      this.addTextKey(d, 1)
      setTimeout(()=>{
        console.log('Setting state for data.......')
        this.setState((state, props) => {
          return {data: [d]};
        });
      },100)
    })
  }

  onLinkChange(link) {
    // console.log(link)
    if(link && link.length > 20) {
      link = link.replace('.net', '.dev')
      const http = link.split('//')[0]
      const host = link.split('//')[1].split('/')[0]
      const uniqueLink = link.split('//')[1].split('/')[1]
      const path = `${http}//${host}/${uniqueLink}`
      this.setState({baseUrlPath: path.trim()}, () => {
        this.getData()
      })
    } 
  }

  onSelectItems(item) {
    const { allowedFileTypes, allowedImageTypes, allowedMediaFiles } = this.state
    const filePath = `${this.state.baseUrlPath}/${item.path}`
    let fileExtension = item.path.split('.').pop()
    // console.log('fileExtension', fileExtension)
    if (allowedFileTypes.indexOf(fileExtension) >= 0){
      skylink.getFileContent(filePath).then( data => {
        // console.log('fileExtension ----> ', fileExtension)
        fileExtension = item.contenttype.split('/').pop()
        if(fileExtension === 'octet-stream') fileExtension = 'text'
        if(allowedFileTypes.indexOf(fileExtension) !== -1) {
          this.setState((state, props) => {
            if(fileExtension === 'json') data = JSON.stringify(data)
            return {editorData: data, editorFileType: fileExtension};
          });
        } else {
          this.setState((state, props) => {
            return {editorData: '<h2>File format is not supported</h2>', editorFileType: fileExtension};
          });
        }
      })
    } else if (allowedImageTypes.indexOf(fileExtension) >= 0){
      this.setState((state, props) => {
        return {editorData: filePath, editorFileType: fileExtension};
      });
    } else if (allowedMediaFiles.indexOf(fileExtension) >= 0) {
      this.setState((state, props) => {
        // console.log({filePath, fileExtension})
        return {editorData: filePath, editorFileType: fileExtension};
      });
    } else {
      this.setState((state, props) => {
        return {editorData: '<h2>File format is not supported</h2>', editorFileType: fileExtension};
      });
    }
  }

  renderEditor() {

  }

  componentDidMount() {
    this.getData()
  }

  render() {
    const { baseUrlPath, allowedMediaFiles, fileViewerStyle,
      data, container, editorData, editorFileType, 
      aceEditorStyles, headerStyle,
      allowedFileTypes, allowedImageTypes,
      headerSearchBox, spanStyles } = this.state;
      let editor
      // console.log('editorFileType--------> ', editorFileType)
      if (allowedFileTypes.indexOf(editorFileType) >= 0) {
        editor = <AceEditor
          style={aceEditorStyles}
          mode={editorFileType}
          theme="twilight"
          value={editorData}
          name="SKYLINK_EDITOR_1"
          editorProps={{ $blockScrolling: true }}
        />
      } else if (allowedImageTypes.indexOf(editorFileType) >= 0) {
        const img = {
          title: editorData.split('/').pop().split('.')[0],
          desc: editorData.split('/').pop(),
          thumbnail: editorData,
          src: editorData
        }
        editor = <Gallery 
          images={[img]}
          />
      } else if (allowedMediaFiles.indexOf(editorFileType) >= 0) {
        editor = <FileViewer
          style={fileViewerStyle}
          fileType={editorFileType}
          filePath={editorData}
          />
      } else {
        editor = 'Soon we will be supporting this file format: ' + editorData
      }
      console.log('render view with new data........')

    return (
      <Layout>
        <div style={headerStyle}>
          <ReactSearchBox
            style={headerSearchBox}
            placeholder="Paste your Skylink here"
            value={baseUrlPath}
            onChange={ (link) => this.onLinkChange(link)}
          />
        </div>
        <TreeView 
          items={data}
          onSelectItem={
            ((item) => {
              this.onSelectItems(item)
            })
          }
          theme="moonlight"
          style={spanStyles}
        />
        <div style={container}> 
            {editor}
        </div>
      </Layout>
    )
  }
}

export default IndexPage;
