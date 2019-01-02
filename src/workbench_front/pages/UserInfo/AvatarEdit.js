import React from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAvatar } from "Store/appStore/action";
import Notice from "Components/Notice";
import ImageCrop from "Components/ImageCrop";
import Ajax from "Pub/js/ajax";
import { langCheck } from "Pub/js/utils.js";
class AvatarEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            imgObj: null,
            src: null,
            newImgSrc: null,
            pixelCrop: null,
            crop: {
                x: 10,
                y: 10,
                width: 80,
                aspect: 1
            }
        };
    }
    /**
     * 模态框取消事件
     */
    onCancel = () => {
        let imgObj = this.refs.webuploaderElement;
        this.setState(
            {
                imgObj: null,
                src: null,
                newImgSrc: null,
                pixelCrop: null,
                visible: false
            },
            () => {
                imgObj.value = "";
            }
        );
    };
    /**
     * 模态框确定事件
     */
    onOk = () => {
        let imgName = `${this.props.userId}.jpeg`;
        let { imgObj, pixelCrop } = this.state;
        let { json } = this.props;
        // 获取剪切后的图片文件Blob对象
        let imgFileObj = getCroppedImg(imgObj, pixelCrop, imgName, "base64");
        Ajax({
            url: `/nccloud/platform/userimage/operateuserimage.do`,
            data: {
                file: imgFileObj
            },
            loading: true,
            info: {
                name: langCheck(
                    "UserInfo-000000",
                    "pages",
                    json
                ) /* 国际化处理： 账户设置*/,
                action: langCheck(
                    "UserInfo-000001",
                    "pages",
                    json
                ) /* 国际化处理： 头像上传*/
            },
            success: ({ data: { data } }) => {
                this.props.setAvatar(imgFileObj);
                this.onCancel();
            }
        });
    };
    /**
     * 文件选择事件
     */
    onSelectFile = e => {
        let { json } = this.props;
        if (e.target.files && e.target.files.length > 0) {
            let imgFileObj = e.target.files;
            console.log(imgFileObj);
            if (imgFileObj[0].size > 10 * 1024 * 1024) {
                Notice({
                    status: "warning",
                    msg: langCheck(
                        "UserInfo-000002",
                        "pages",
                        json
                    ) /* 国际化处理： 上传的图片大于10M,请重新选择!*/
                });
                return;
            }
            const reader = new FileReader();
            reader.addEventListener(
                "load",
                () => {
                    this.setState({
                        src: reader.result,
                        visible: true
                    });
                },
                false
            );
            reader.readAsDataURL(imgFileObj[0]);
        }
    };
    /**
     * 图片加载完毕
     * @param {Object}  imgObj - 图片DOM对象。
     * @param {Object} pixelCrop - 像素转换裁剪后的对象
     */
    onImageLoaded = (imgObj, pixelCrop) => {
        let imgName = `${this.props.userId}.jpeg`;
        if (imgObj) {
            // 获取裁剪图片base64
            let newImgSrc = getCroppedImg(imgObj, pixelCrop, imgName, "base64");
            this.setState({
                newImgSrc,
                pixelCrop,
                imgObj
            });
        }
    };
    /**
     * 调整大小，调整大小，拖动或轻推后发生的回调
     * @param {Object}  crop - 当前裁剪状态对象。
     * @param {Object} pixelCrop - 像素转换裁剪后的对象
     */
    onCropComplete = (crop, pixelCrop) => {
        let imgName = `${this.props.userId}.jpeg`;
        let { imgObj } = this.state;
        if (imgObj) {
            // 获取裁剪图片base64
            let newImgSrc = getCroppedImg(imgObj, pixelCrop, imgName, "base64");
            this.setState({
                newImgSrc,
                pixelCrop
            });
        }
    };
    /**
     * 裁剪变化状态
     * @param {Object}  crop - 当前裁剪状态对象。
     */
    onCropChange = crop => {
        this.setState({ crop });
    };
    render() {
        let { src, crop, visible, newImgSrc } = this.state;
        let { json } = this.props;
        return (
            <div className="userlogo">
                <input
                    type="file"
                    name="file"
                    class="webuploader-element-invisible"
                    id="webuploader-element-invisible"
                    onChange={this.onSelectFile}
                    ref={"webuploaderElement"}
                    accept="image/jpg,image/jpeg,image/png,image/gif"
                />
                <img src={this.props.avatar} width="64" height="64" />
                <i className="iconfont icon-bianji" />
                <label
                    class="webuploader-element-invisible-label"
                    htmlFor="webuploader-element-invisible"
                />
                <Modal
                    title={langCheck(
                        "UserInfo-000003",
                        "pages",
                        json
                    )} /* 国际化处理： 头像编辑*/
                    visible={visible}
                    maskClosable={false}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    width={590}
                    okText={langCheck(
                        "UserInfo-000004",
                        "pages",
                        json
                    )} /* 国际化处理： 确定*/
                    cancelText={langCheck(
                        "UserInfo-000005",
                        "pages",
                        json
                    )} /* 国际化处理： 取消*/
                >
                    <ImageCrop
                        imgSrc={src}
                        imgCrop={crop}
                        newImgSrc={newImgSrc}
                        onImageLoaded={this.onImageLoaded}
                        onCropComplete={this.onCropComplete}
                        onCropChange={this.onCropChange}
                    />
                </Modal>
            </div>
        );
    }
}
AvatarEdit.propTypes = {
    setAvatar: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
};
export default connect(
    state => ({
        avatar: state.appData.avatar,
        userId: state.appData.userId
    }),
    { setAvatar }
)(AvatarEdit);

/**
 * 获取裁剪后的图片
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
 * @param {String} fileName - Name of the returned file in Promise
 * @param {String} type - 需要返回的数据类型 base64 或者 fileObj
 */
const getCroppedImg = (image, pixelCrop, fileName, type) => {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );
    // As Base64 string
    if (type == "base64") {
        return canvas.toDataURL("image/jpeg");
    } else {
        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(file => {
                file.name = fileName;
                resolve(file);
            }, "image/jpeg");
        });
    }
};
