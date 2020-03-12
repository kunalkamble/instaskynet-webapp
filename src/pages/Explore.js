import React, {Component} from 'react';
import skylink from 'skylink'
import Layout from '../components/Layout';
import TreeExplorer from '../components/TreeExplorer';
import ReactSearchBox from 'react-search-box'

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-haml";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/theme-twilight";


class ExplorePage extends Component {
  constructor(props) {
    super(props);
    this.onSelectItem = this.onSelectItem.bind(this)
    this.state = {
      basePath: '',
      selectedItem: '',
      searchSkylink: '',
      data: [],
      dropDownData: [],
      editorData: '<p>Hello from Skylink Editor v1.0.1!</p>',
      editorFileType: 'html',
      allowedFileTypes: ['javascript', 'css', 'java', 'html', 'htm', 'scss', 'haml', 'php'],
      aceEditorStyles: {
        height: '100%',
        width: '100%',
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
      }
    };
  }
  addTextKey(data, counter) {
    for (let item in data) {
        // console.log(item)
        data['text'] = data.name
        data['id'] = counter
        if(item === 'type' && data[item] === 'file') data['isLeaf'] = true
        if(item === 'children') {
          for (let key in data.children) {
            counter = counter + 1
            this.addTextKey(data.children[key], counter)
          }
          // data.children.forEach(element => {
              
          // });
        }
    }
    counter = counter + 1
  }
  getData() {
    skylink.explore(this.state.basePath).then(d => {
      this.addTextKey(d, 1)
      setTimeout(()=>{
        this.setState((state, props) => {
          return {data: [d]};
        });
      },100)
    })
  }
onLinkChange(link) {
  if(link && link.length > 20) {
    const http = link.split('//')[0]
    const host = link.split('//')[1].split('/')[0]
    const uniqueLink = link.split('//')[1].split('/')[1]
    const path = `${http}//${host}/${uniqueLink}`
    this.setState({basePath: path.trim()}, () => {
      this.getData()
    })
  } 
}
  onSelectItem(item) {
    const { allowedFileTypes } = this.state
      skylink.getFileContent(`${this.state.basePath}/${item.path}`).then( data => {
        const fileType = item.contenttype.split('/').pop()
        if(allowedFileTypes.indexOf(fileType) !== -1) {
          this.setState((state, props) => {
            console.log('item.type', fileType)
            return {editorData: data, editorFileType: fileType};
          });
        } else {
          this.setState((state, props) => {
            return {editorData: '<h2>File format is not supported</h2>', editorFileType: 'html'};
          });
        }
      })
  }
  componentWillMount() {
    // this.getData()
  }

  render() {
    const { basePath, selectedItem, 
      data, container, editorData, editorFileType, 
      aceEditorStyles, headerStyle, 
      headerSearchBox } = this.state;
    console.log('selectedItem -> ', selectedItem)
    return (
      <Layout>
        <div style={headerStyle}>
          <ReactSearchBox
            style={headerSearchBox}
            placeholder="Paste your Skylink here"
            value={basePath}
            onChange={ (link) => this.onLinkChange(link)}
          />
        </div>
        <TreeExplorer onSelectItem={this.onSelectItem} data={data}  />
        <div style={container}>
          <AceEditor
            style={aceEditorStyles}
            mode={editorFileType}
            theme="twilight"
            value={editorData}
            name="SKYLINK_EDITOR_1"
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </Layout>
    )
  }
}

export default ExplorePage;
