import PropTypes from 'prop-types';
import React, { Component } from 'react';
import skylink from 'skylink';
import dynamic from 'next/dynamic';
import ReactSearchBox from 'react-search-box';
const TreeView = dynamic(import('deni-react-treeview'), {
    ssr: false
})

class FolderView extends Component {
    constructor() {
        super();
        this.state = {
            selectedItem: '',
            searchSkylink: '',
            editorData: '<p>Hello from Skylink Viewer v1.0.1!</p>',
            editorFileType: 'html',
            allowedFileTypes: ['javascript', 'css', 'java', 'html', 'scss', 'haml',
                'php', 'markdown', 'md', 'js', 'json', 'log', 'text'],
            allowedMediaFiles: ['pdf', 'csv', 'xls', 'xlsx', 'docx', 'mp4', 'MP4', 'webm', 'mp3', 'MP3'],
            allowedAudioFiles: ['mp3', 'MP3'],
            allowedImageTypes: ['png', 'PNG', 'jpeg', 'jpg', 'bmp', 'gif', 'svg'],
            spanStyles: {
                position: 'fixed',
                marginTop: '39px',
                height: 'calc(100% - 98px)',
                border: 0
            },
            fileSearchBoxStyle: {
                width: '300px',
                borderTop: '11px grey solid',
                borderBottom: '12px grey solid',
                backgroundColor: '#a0a0a1',
            },
            fileName: '',
            parentStyle: { display: 'contents' },
        };
    }

    findFileFolder(item, searchText) {
        // console.log(item.name && item.name.toLowerCase().includes(searchText.toLowerCase()))
        // if(item.type === 'folder') {
        //     item.children = item.children.map(child => this.findFileFolder(child, name))
        //     return item
        // }
        // // if(item.children.length) {
        // //     return item
        // // }
        // if(item.path === '/') {
        //     return item
        // }
        // if(item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) {
        //     return item
        // }
    }
    filterFileTree(searchText) {
        // setTimeout(() => {
        //     const _newData = this.props.data.map(item => this.findFileFolder(item, searchText))
        //     console.log(_newData)
        //     console.log(searchText)
        // }, 400)
    }

    onSelectItems(item) {
        console.log('Item clicked: ', item.name)
        const { updateLinkData } = this.props
        const { allowedFileTypes, allowedImageTypes, allowedMediaFiles, allowedAudioFiles  } = this.state
        if (item.type == 'file') {
            let filePath = `${this.props.baseUrlPath}/${item.path}`
            let fileExtension = item.path.split('.').pop()
            // console.log('fileExtension', fileExtension)
            if (allowedFileTypes.indexOf(fileExtension) >= 0) {
                updateLinkData({ isLoading: true })
                skylink.getFileContent(filePath).then(data => {
                    // console.log('fileExtension ----> ', fileExtension)
                    fileExtension = item.contenttype.split('/').pop()
                    if (fileExtension === 'octet-stream') fileExtension = 'text'
                    if (allowedFileTypes.indexOf(fileExtension) !== -1) {
                        if (fileExtension === 'json') data = JSON.stringify(data)
                        updateLinkData({ editorData: data, editorFileType: fileExtension });
                    } else {
                        updateLinkData({ editorData: '<h2>File format is not supported</h2>', editorFileType: fileExtension });
                    }
                    updateLinkData({ isLoading: false })
                })
            } else if (allowedImageTypes.indexOf(fileExtension) >= 0) {
                const image = [{
                    title: filePath.split('/').pop().split('.')[0],
                    desc: filePath.split('/').pop(),
                    thumbnail: filePath,
                    src: filePath
                }]
                updateLinkData({ galleryImages: image, editorFileType: fileExtension });
            } else if (allowedMediaFiles.indexOf(fileExtension) >= 0) {
                const track = [{
                    img: 'https://siasky.net/MACcpP6dUunp0qsf20JykOrSMHkTsoVy5U_gMlg8ygzMNw',
                    name: item.name,
                    desc: item.name,
                    src: filePath
                  }]
                if(allowedAudioFiles.indexOf(fileExtension) >= 0) filePath = track
                updateLinkData({ editorData: filePath, editorFileType: fileExtension });
            } else {
                updateLinkData({ editorData: '<h2>File format is not supported</h2>', editorFileType: fileExtension })
            }
        } else if (item.type === 'folder') {
            const { fileExtension } = this.state
            if(item.children[0].name.split('.').pop() === 'mp3') {
                console.log('Audio Folder clicked: ', item.name)
                const playlist = []
                item.children.map(child => {
                    if (child.type == 'file') {
                        const filePath = `${this.props.baseUrlPath}/${child.path}`
                        playlist.push({
                            img: 'https://siasky.net/MACcpP6dUunp0qsf20JykOrSMHkTsoVy5U_gMlg8ygzMNw',
                            name: child.name,
                            desc: child.name,
                            src: filePath
                            })
                    }
                })
                console.log('playlist', playlist)
                if (playlist.length) {
                    updateLinkData({ editorData: playlist, editorFileType: 'mp3' })
                }
            } else {
                const { allowedImageTypes } = this.state
                const images = []
                item.children.map(child => {
                    if (child.type == 'file') {
                        // console.log(child)
                        let fileExtension = child.path.split('.').pop()
                        // console.log('fileExtension', fileExtension, child)
                        if (allowedImageTypes.indexOf(fileExtension) >= 0) {
                            const filePath = `${this.props.baseUrlPath}/${child.path}`
                            images.push({
                                title: filePath.split('/').pop().split('.')[0],
                                desc: filePath.split('/').pop(),
                                thumbnail: filePath,
                                src: filePath
                            })
                        }
                    }
                })
                if (images.length) {
                    updateLinkData({ galleryImages: images, editorFileType: 'jpg' })
                }
            }

            
            // console.log(images)   
        }
    }

    render() {
        const { data } = this.props
        const { spanStyles, parentStyle, fileSearchBoxStyle, fileName } = this.state
        return (
            <div style={parentStyle}>
                <TreeView
                    ref="treeview"
                    className="second-step"
                    items={data}
                    onSelectItem={this.onSelectItems.bind(this)}
                    theme="moonlight"
                    style={spanStyles}
                />
            </div>

        )

    }
}

FolderView.displayName = 'FolderView';
FolderView.propTypes = {
    data: PropTypes.array,
    baseUrlPath: PropTypes.string,
    updateLinkData: PropTypes.func
};

export default FolderView;
