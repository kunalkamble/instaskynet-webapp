import PropTypes from 'prop-types';
import React, { Component } from 'react';
import skylink from 'skylink';
import dynamic from 'next/dynamic';
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
            allowedImageTypes: ['png', 'PNG', 'jpeg', 'jpg', 'bmp', 'gif', 'svg'],
            spanStyles: {
                position: 'fixed',
                height: 'calc(100% - 60px)',
                border: 0
            }
        };
    }

    onSelectItems(item) {
        console.log(item)
        if(item.type == 'file') {
            const { allowedFileTypes, allowedImageTypes, allowedMediaFiles } = this.state
            const { updateLinkData } = this.props
            const filePath = `${this.props.baseUrlPath}/${item.path}`
            let fileExtension = item.path.split('.').pop()
            // console.log('fileExtension', fileExtension)
            if (allowedFileTypes.indexOf(fileExtension) >= 0) {
                updateLinkData({isLoading: true})
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
                    updateLinkData({isLoading: false})
                })
            } else if (allowedImageTypes.indexOf(fileExtension) >= 0) {
                const image = [{
                    title: filePath.split('/').pop().split('.')[0],
                    desc: filePath.split('/').pop(),
                    thumbnail: filePath,
                    src: filePath
                  }]
                updateLinkData({ galleryImages: image });
            } else if (allowedMediaFiles.indexOf(fileExtension) >= 0) {
                updateLinkData({ editorData: filePath, editorFileType: fileExtension });
            } else {
                updateLinkData({ editorData: '<h2>File format is not supported</h2>', editorFileType: fileExtension })
            }
        } else if (item.type === 'folder') {
            const { allowedImageTypes } = this.state
            const { updateLinkData } = this.props
            const images = []
            item.children.map(child => {
                if(child.type == 'file') {
                    // console.log(child)
                    let fileExtension = child.path.split('.').pop()
                    console.log('fileExtension', fileExtension, child)
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
            if(images.length) {
                updateLinkData({galleryImages: images, editorFileType: 'jpg'})
            }
            console.log(images)   
        }
    }

    render() {
        const { data } = this.props
        const { spanStyles } = this.state
        return (
            <TreeView
                ref="treeview"
                items={data}
                onSelectItem={ this.onSelectItems.bind(this) }
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
    updateLinkData: PropTypes.func
};

export default FolderView;
