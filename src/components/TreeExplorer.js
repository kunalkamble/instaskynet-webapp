import React, {PureComponent} from 'react';
// import PropTypes from 'prop-types';

// import {Treebeard} from 'react-treebeard';
import TreeView from 'deni-react-treeview';

class TreeExplorer extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            spanStyles: {
                position: 'fixed',
                height: 'calc(100% - 60px)',
                border: 0
              }
        }
        this.onToggle = this.onToggle.bind(this);
    }
    
    
    onToggle(node, toggled){
        const {cursor} = this.props;
        // this.getData()
        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }
        node.active = true;
        if (node.children) { 
            node.toggled = toggled; 
        }
        this.setState(() => ({cursor: node}));
    }
    render(){
        const { spanStyles} = this.state;
        const { onSelectItem, data } = this.props
        return (
            <TreeView items={ data } 
                onSelectItem={ ((item) => {
                        onSelectItem(item) 
                    }).bind(this)
                }
                theme="moonlight" 
                style={spanStyles} />
        );
    }
}

TreeExplorer.displayName = 'Tree View';

export default TreeExplorer