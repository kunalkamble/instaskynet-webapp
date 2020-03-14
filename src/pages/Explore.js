import React, {Component} from 'react';
import skylink from 'skylink'
import ReactSearchBox from 'react-search-box'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout';

const TreeView = dynamic(import('deni-react-treeview'), {
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
    return ace;
  },
  {
    // eslint-disable-next-line react/display-name
    ssr: false,
  },
);

class ExplorePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrlPath: 'https://siasky.dev/_A5w9UBSNczl5kFwkn8CD_aAOV62Thwk2_E9yIU1sMWP2w',
      selectedItem: '',
      searchSkylink: '',
      data: [],
      dropDownData: [],
      editorData: '<p>Hello from Skylink Editor v1.0.1!</p>',
      editorFileType: 'html',
      allowedFileTypes: ['javascript', 'css', 'java', 'html', 'scss', 'haml', 'php'],
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
      },
      spanStyles: {
        position: 'fixed',
        height: 'calc(100% - 60px)',
        border: 0
      }
    };
  }

  addTextKey(data, counter) {
    for (let item in data) {
        data['text'] = data.name
        data['id'] = counter
        if(item === 'type' && data[item] === 'file') data['isLeaf'] = true
        if(item === 'children') {
          for (let key in data.children) {
            counter = counter + 1
            this.addTextKey(data.children[key], counter)
          }
        }
    }
    counter = counter + 1
  }

  getData() {
    console.log('Getting data........')
    skylink.explore(this.state.baseUrlPath).then(d => {
      console.log(d)
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
    console.log(link)
    if(link && link.length > 20) {
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
    const { allowedFileTypes } = this.state
    skylink.getFileContent(`${this.state.baseUrlPath}/${item.path}`).then( data => {
      const fileType = item.contenttype.split('/').pop()
      if(allowedFileTypes.indexOf(fileType) !== -1) {
        this.setState((state, props) => {
          return {editorData: data, editorFileType: fileType};
        });
      } else {
        this.setState((state, props) => {
          return {editorData: '<h2>File format is not supported</h2>', editorFileType: fileType};
        });
      }
    })
  }

  renderEditor() {

  }

  componentDidMount() {
    this.getData()
  }

  render() {
    const { baseUrlPath, selectedItem, 
      data, container, editorData, editorFileType, 
      aceEditorStyles, headerStyle,
      allowedFileTypes, 
      headerSearchBox, spanStyles } = this.state;
      let editor
      if (allowedFileTypes.indexOf(editorFileType) >= 0) {
        editor = <AceEditor
          style={aceEditorStyles}
          mode={editorFileType}
          theme="twilight"
          value={editorData}
          name="SKYLINK_EDITOR_1"
          editorProps={{ $blockScrolling: true }}
        />
      } else {
        editor = 'Soon we will be supporting this file format'
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
        <TreeView items={data}
            onSelectItem={((item) => {
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

export default ExplorePage;
