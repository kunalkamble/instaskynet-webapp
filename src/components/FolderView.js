import PropTypes from 'prop-types';
import React, { Component } from 'react';

const TreeView = dynamic(import('deni-react-treeview'), {
ssr: false
})

class FolderView extends Component {
  constructor() {
    super();
    this.props.getData = getData
    this.state = {
        baseUrlPath: this.props.baseUrlPath,
        selectedItem: '',
        searchSkylink: '',
        data: [],
        editorData: '<p>Hello from Skylink Viewer v1.0.1!</p>',
        editorFileType: 'html',
        allowedFileTypes: ['javascript', 'css', 'java', 'html', 'scss', 'haml', 
        'php', 'markdown', 'md', 'js', 'json', 'log', 'text'],
        allowedMediaFiles: ['pdf', 'csv', 'xls', 'xlsx', 'docx', 'mp4', 'MP4', 'webm', 'mp3', 'MP3'],
        allowedImageTypes: ['png', 'PNG', 'jpeg', 'jpg', 'bmp', 'gif', 'svg'],
        spanStyles: {
          position: 'fixed',
          height: 'calc(100% - 60px)',
          border: 0
        }
      };
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

  
  render() {
      return (
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
      )
        
  }
}

FolderView.displayName = 'FolderView';
FolderView.propTypes = {
  data: PropTypes.array,
  baseUrlPath: PropTypes.string,
  getData: PropTypes.func
};

export default FolderView;
