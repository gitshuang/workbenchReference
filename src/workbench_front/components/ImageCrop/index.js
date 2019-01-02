import React from "react";
import ReactCrop, { makeAspectCrop } from "react-image-crop";
import { langCheck } from 'Pub/js/utils';
import "react-image-crop/dist/ReactCrop.css";
import "./index.less";
class ImageCrop extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        // let { langCheck } = window;
        let { imgSrc, imgCrop, newImgSrc } = this.props;
        return (
            <div className="image-crop-container">
                <div className="image-crop">
                    {imgSrc && (
                        <ReactCrop
                            src={imgSrc}
                            crop={imgCrop}
                            keepSelection={true}
                            maxWidth={100}
                            maxHeight={100}
                            minWidth={10}
                            minHeight={10}
                            onImageLoaded={this.props.onImageLoaded}
                            onComplete={this.props.onCropComplete}
                            onChange={this.props.onCropChange}
                        />
                    )}
                </div>
                <div className="image-list">
                    <span className="title">{langCheck('0000PUB-000019')}</span>{/* 国际化处理： 预览*/}
                    <div className="img-item img-128">
                        <img src={newImgSrc} />
                        <span className="img-title">128px x 128px</span>
                    </div>
                    <div className="img-item img-64">
                        <img src={newImgSrc} />
                        <span className="img-title">64px x 64px</span>
                    </div>
                    <div className="img-item img-32">
                        <img src={newImgSrc} />
                        <span className="img-title">32px x 32px</span>
                    </div>
                </div>
            </div>
        );
    }
}
export default ImageCrop;
