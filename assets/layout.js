import React from 'react';
import { Layout, Affix, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { withData } from './components/HOCs/DataHOC';
import { withRouter } from 'react-router-dom';
import styles from './app.scss';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class AppLayout extends React.Component {
  constructor(props) {
    super(props);

    this.getDefaultSelectedKeys = this.getDefaultSelectedKeys.bind(this);
  }

  getYearsMenuItems() {
    const currYear = new Date().getFullYear();
    const currDecade = Math.floor(currYear / 10) * 10;
    const yearArr = [];
    let count = 0;

    while (count < 10) {
      const val = currYear - count;

      yearArr.push({ key: `/year/${val}`, text: val });
      count += 1;
    }

    count = 0;

    while (count < 3 * 10) {
      const val = currDecade - count;

      yearArr.push({ key: `/year/${val}s`, text: `${val} 年代` });
      count += 10;
    }

    return yearArr.map(({ key, text }) => (
      <Menu.Item key={key}><Link to={key}>{text}</Link></Menu.Item>
    ));
  }

  getGenresMenuItems() {
    return this.props.data.genres.map(({ name }) => (
      <Menu.Item key={`/genres/${name}`}>
        <Link to={`/genres/${name}`}>{name}</Link>
      </Menu.Item>
    ));
  }

  getDefaultSelectedKeys() {
    const path = this.props.location.pathname;
    let res;

    if (path === '/') {
      res = 'recommend';
    } else {
      res = path;
    }

    return [res];
  }

  render() {
    return (
      <Layout>
        <Affix top={0}>
          <Header className={styles.header}>
            <div className={styles.logo}>Kent Trailer</div>
          </Header>
        </Affix>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              theme="dark"
              defaultSelectedKeys={this.getDefaultSelectedKeys()}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="recommend">
                <Link to="/"><Icon type="like" />为你推荐</Link>
              </Menu.Item>
              <SubMenu key="rate" title={<span><Icon type="smile" />按评分</span>}>
                <Menu.Item key="/rate/10-10"><Link to="/rate/10-10">10 分</Link></Menu.Item>
                <Menu.Item key="/rate/9-10"><Link to="/rate/9-10">9 - 10 分</Link></Menu.Item>
                <Menu.Item key="/rate/8-9"><Link to="/rate/8-9">8 - 9 分</Link></Menu.Item>
                <Menu.Item key="/rate/0-8"><Link to="/rate/0-8">8 分以下</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="years" title={<span><Icon type="calendar" />按年代</span>}>
                {this.getYearsMenuItems()}
              </SubMenu>
              <SubMenu key="genres" title={<span><Icon type="appstore" />按分类</span>}>
                {this.getGenresMenuItems()}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px 24px 0 24px' }}>
            <Content style={{ background: '#fff', margin: 0 }}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(withData(AppLayout));
