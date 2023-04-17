import Konva from "konva";
import PopupBgImg from "./assets/images/popup_02.png"

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWNmOGJmZi0xZTljLTQ4ZDUtODg2MC02MGYzZTc0NTYyOWIiLCJpZCI6MTQ0NDEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjU1NzM0NTl9.nvBAZuFFOd_LCYGqWwafxk9J6EUkmvzR2M3Ni22b8YQ"
const viewer = new Cesium.Viewer("cesiumContainer");

if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
  var vtxf_dpr = window.devicePixelRatio;
  while (vtxf_dpr >= 2.0) { vtxf_dpr /= 2.0; }
  viewer.resolutionScale = vtxf_dpr;
}
viewer.scene.fxaa = true;
viewer.scene.postProcessStages.fxaa.enabled = true;

const createPopup = (data, options) => {
  return new Promise((resolve) => {
    const width = options.width;
    const height = options.height;
    // const el = document.querySelector(".konva")

    const el = document.createElement("div");

    const stage = new Konva.Stage({
      container: el,
      width: width,
      height: height,
      scale: {
        x: 0.25,
        y: 0.25
      }
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const image = new Image(width, height);
    image.onload = () => {

      console.log("data:", width, height);

      const popupBg = new Konva.Image({
        image
      });
      layer.add(popupBg);

      const titleText = new Konva.Text({
        x: 0,
        y: 40,
        text: `西乡`,
        fontSize: 42,
        fontFamily: 'Arial',
        fontStyle: "bold",
        width: width,
        align: 'center',
        fill: "#fff"
      });
      layer.add(titleText);

      const content1Text = new Konva.Text({
        x: 50,
        y: titleText.y() + titleText.height() + 10,
        text: `综合巡查:${data.xcCount}`,
        fontSize: 42,
        fontFamily: 'Arial',
        fontStyle: "bold",
        width: width,
        fill: "red"
      })
      layer.add(content1Text);

      const content2Text = new Konva.Text({
        x: 50,
        y: content1Text.y() + content1Text.height() + 20,
        text: `综合整治:${data.zzCount}`,
        fontSize: 42,
        fontFamily: 'Arial',
        fontStyle: "bold",
        width: width,
        fill: "red"
      })
      layer.add(content2Text);

      resolve(stage.toCanvas({
        width: width / 4,
        height: height / 4,
        x: 0,
        y: 0,
        pixelRatio: 4
      }))
    }
    image.src = PopupBgImg;
  })
}

const scene = viewer.scene;
const billboards = scene.primitives.add(new Cesium.BillboardCollection());

const randomPointOnSZ = (count) => {
  return new Array(count).fill(0).map(item => ({
    id: window.btoa(Date.now()),
    lng: 112 + Math.random(),
    lat: 23 + Math.random(),
    xcCount: parseInt(Math.random() * 1000),
    zzCount: parseInt(Math.random() * 1000)
  }))
}

const points = randomPointOnSZ(100);
points.forEach(point => {

  const promise = createPopup(point, {
    width: 926,
    height: 490
  });

  const billboard = billboards.add({
    // image: PopupBgImg,
    position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 0),
    width: 926 / 4,
    height: 490 / 4,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.0, 8.0e6, 10.0)
  });
  billboard.setImage(point.id, () => promise)
  // document.body.appendChild(canvas)
  // console.log("img:", promise.then(c => console.log(c.toDataURL("image/png"))));
});