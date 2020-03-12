import React, {Component} from 'react';
import Layout from '../components/Layout';
import Gallery from '../components/Gallery';
import img_set from '../components/images'

class IndexPage extends Component {
  render() {
    return (
      <Layout>
        <Gallery images={img_set} />
      </Layout>
    )
  }
}

export default IndexPage;
