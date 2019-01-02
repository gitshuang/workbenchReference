import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
import Svg from 'Components/Svg';
const loop=(data, searchValue)=>{
    return data.map((item) => {
        let { code, name, pk } = item;
        if (code === '00') {
            text = `${name}`;
        }
        let text = `${code} ${name}`;
        const index = text.indexOf(searchValue);
        const beforeStr = text.substr(0, index);
        const afterStr = text.substr(index + searchValue.length);
        const title =
            index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : (
                <span>
                    <span> {text} </span>
                </span>
            );
        if (item.children && item.children.length > 0) {
            return (
                <TreeNode
                    key={pk}
                    title={title}
                    refData={item}
                    icon={({ expanded }) => {
                        return (
                            <Svg
                                width={20}
                                height={20}
                                xlinkHref={
                                    expanded
                                        ? "#icon-wenjianjiadakai"
                                        : "#icon-wenjianjia"
                                }
                            />
                        );
                    }}
                    switcherIcon={({ expanded }) => {
                        return (
                            <i
                                className={`font-size-18 iconfont ${
                                    expanded
                                        ? "icon-shu_zk"
                                        : "icon-shushouqi"
                                }`}
                            />
                        );
                    }}
                >
                    {loop(item.children, searchValue)}
                </TreeNode>
            );
        }
        return <TreeNode icon={<span className='tree-dot' />} key={pk} title={title} refData={item} />;
    });
}
export default loop;
