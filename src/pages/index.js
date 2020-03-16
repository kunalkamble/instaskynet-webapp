import React, {Component} from 'react';
import skylink from 'skylink';
import ReactSearchBox from 'react-search-box';
import dynamic from 'next/dynamic';
import Loader from 'react-loader-spinner';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../components/Layout';
import Gallery from '../components/Gallery';
import FileEditor from '../components/FileEditor';
import FolderView from '../components/FolderView';
import queryString from 'query-string';
import { Player } from 'video-react';

import 'video-react/dist/video-react.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
const FileViewer = dynamic(import('react-file-viewer'), {
  ssr: false
})

class IndexPage extends Component {
  constructor(props) {
    super(props);
    let params = queryString.parse(this.props.location.search)
    this.state = {
      baseUrlPath:  `https://siasky.dev/${params.skylink || 'GAD8NUtPi8DcPUKzaoCkZ6NXphtuirH7tBl44FqwflWXnw'}`,
      viewerIsOpen: false,
      galleryImages: [],
      currImg: 0,
      fileViewerStyle: {
        width: '100%'
      },
      isLoading: false,
      data: [],
      editorData: '<p>Hello from Skylink Viewer v1.0.1!</p>',
      editorFileType: 'html',
      supportedExt: ['mp4', 'MP4', 'webm', 'mov', 'pdf', 'csv', 'xls', 'xlsx', 
        'docx', 'mp3', 'MP3', 'png', 'PNG', 'jpeg', 'jpg', 'bmp', 'gif', 'svg',
        'javascript', 'css', 'java', 'html', 'scss', 'haml',
        'php', 'markdown', 'md', 'js', 'json', 'log', 'text'],
      allowedFileTypes: ['javascript', 'css', 'java', 'html', 'scss', 'haml',
                'php', 'markdown', 'md', 'js', 'json', 'log', 'text'],
      allowedMediaFiles: ['pdf', 'csv', 'xls', 'xlsx', 'docx', 'mp3', 'MP3'],
      allVideoFileFormat: ['mp4', 'MP4', 'webm', 'mov'],
      allowedImageTypes: ['png', 'PNG', 'jpeg', 'jpg', 'bmp', 'gif', 'svg'],
      container: {
        position: 'fixed',
        overflowY: 'auto',
        height: '100%',
        width: 'calc(100% - 310px)',
        marginLeft: '310px',
        marginTop: '40px',
      },
      loadingStyle: {
        zIndex: '9',
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '30%',
      },
      headerStyle: {
        padding: '0px 0px',
        width: '100%',
        zIndex: 1
      },
      headerSearchBox: {
        marginLeft: '150px',
        width: '300px'
      },
      spanStyles: {
        position: 'fixed',
        height: 'calc(100% - 60px)',
        border: 0
      },
      playerStyle: {
        paddingTop: '10px',
        paddingRight: '10px',
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
    this.setState({isLoading: true})
    skylink.explore(this.state.baseUrlPath).then(d => {
      const extension = d.name.split('.').pop()
      // console.log(d)
      if(extension && this.state.supportedExt.indexOf(extension) >= 0 && d.children.length === 1) {
        // console.log('extension', extension)
        d = {...d, ...d.children[0]}
        d.text = d.name
        d.isLeaf = true
        d.id = new Date()
        delete d.children
        setTimeout(()=>{
          // console.log('Setting state for data.......', d)
          this.setState((state, props) => {
            return {data: [d], isLoading: false, 
              editorFileType: d.contenttype.split('/').pop(), 
              editorData: this.state.baseUrlPath};
          });
        },100)
      } else {
        this.addTextKey(d, 1)
        setTimeout(()=>{
          // console.log('Setting state for data.......', d)
          this.setState((state, props) => {
            return {data: [d], isLoading: false,};
          });
        },100) 
      }
    })
  }

  updateLinkData(data) {
    this.setState({ ...data });
  }

  onLinkChange(link) {
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

  componentDidMount() {
    this.getData()
  }

  render() {
    const { baseUrlPath, fileViewerStyle, playerStyle, supportedExt,
      data, container, editorData, editorFileType, headerStyle,
      allowedFileTypes, allowedImageTypes, allowedMediaFiles, isLoading, loadingStyle,
      headerSearchBox, galleryImages, allVideoFileFormat } = this.state;
      let loading
      if (isLoading) {
        loading = <Loader
            style={loadingStyle}
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
          />
      } else {
        loading = ''
      }
      // console.log('editorFileType --> ', editorFileType)
      let editor
      if (allowedFileTypes.indexOf(editorFileType) >= 0) {

        editor = <FileEditor editorFileType={editorFileType} editorData={editorData} />

      } else if (allowedImageTypes.indexOf(editorFileType) >= 0) {
        editor = <Gallery 
            images={galleryImages}
          />
      } else if (allVideoFileFormat.indexOf(editorFileType) >= 0) {
        editor = <div style={playerStyle}>
          <Player 
            playsInline
            autoPlay
            src={editorData || baseUrlPath}
          />
          {/* <source  />
        </Player> */}
        </div>
      } else if (allowedMediaFiles.indexOf(editorFileType) >= 0) {
        // console.log(editorData)
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
        <FolderView 
          data={data} 
          baseUrlPath={baseUrlPath} 
          updateLinkData={this.updateLinkData.bind(this)} 
        />
        <div style={container}> 
            {editor}
        </div>
        {loading}
      </Layout>
    )
  }
}

export default IndexPage;
