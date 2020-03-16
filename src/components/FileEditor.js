import PropTypes from 'prop-types';
import React, { Component } from 'react';
import dynamic from 'next/dynamic';

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

class FileEditor extends Component {
  constructor() {
    super();
    this.state = {
        aceEditorStyles: {
            height: 'calc(100% - 10px)',
            width: '100%',
          }
      };
  }
  
  render() {
      const { editorFileType, editorData } = this.props
      const { aceEditorStyles } = this.state
      return (
        <AceEditor
          style={aceEditorStyles}
          mode={editorFileType}
          theme="twilight"
          value={editorData}
          name="SKYLINK_EDITOR_1"
          editorProps={{ $blockScrolling: true }}
        />
      )
        
  }
}

FileEditor.displayName = 'FileEditor';
FileEditor.propTypes = {
  editorData: PropTypes.string,
  aceEditorStyles: PropTypes.string
};

export default FileEditor;
