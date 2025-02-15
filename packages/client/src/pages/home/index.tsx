import React, { useState } from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { InputNumber, Popover, Slider } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import earthImg from "../../assets/earth.png";
import grassImg from "../../assets/grass.png";
import waterImg from "../../assets/water.png";
import wallImg from "../../assets/wall.png";
import stoneImg from "../../assets/stone.png";
import holeImg from "../../assets/hole.png";

const Home = () => {
  const [space, setSpace] = useState(500);
  const [grass, setGrass] = useState(30);
  const [water, setWater] = useState(30);
  const [stone, setStone] = useState(30);
  const [hole, setHole] = useState(30);

  const maxImmovable = ~~(space * 0.15);

  return (
    <div className="home-wrapper">
      <h1>MAPMAKER</h1>
      <p className="desc">
        This is a map random generator. We attempt to use a set of rules to
        generate maze maps with different styles. As long as you continue to
        explore within the known map, the map will be gradually completed. Fill
        in the necessary parameters below to get started.
      </p>
      <ul className="cfg-list">
        <li>
          <div className="img-wrapper">
            <img src={earthImg} alt="Space" />
            <Popover
              placement="topRight"
              content="The content in space. Can be moved The quantity is 10%~15% of the space"
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>

          <h3>Space</h3>
          <InputNumber value={space} onChange={(value) => setSpace(~~value)} />
        </li>
        <li>
          <div className="img-wrapper">
            <img src={grassImg} alt="Grass" />
            <Popover
              width={100}
              placement="topRight"
              content="The content in space. It cannot be moved. Can be destroyed, and after destruction, it becomes a space The quantity is 10%~15% of the space"
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <h3>Grass</h3>
          <Slider
            value={grass}
            min={1}
            max={maxImmovable}
            onChange={(value) => setGrass(value)}
          />
          <div className="cfg-count">{grass}</div>
        </li>
        <li>
          <div className="img-wrapper">
            <img src={waterImg} alt="Sea" />
            <Popover
              placement="topRight"
              content="The content in space. It cannot be moved. Can be destroyed, and after destruction, it becomes a space. The quantity is 10%~15% of the space"
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <h3>Sea</h3>
          <Slider
            value={water}
            min={1}
            max={maxImmovable}
            onChange={(value) => setWater(value)}
          />
          <div className="cfg-count">{water}</div>
        </li>
        <li>
          <div className="img-wrapper">
            <img src={stoneImg} alt="Stone" />
            <Popover
              placement="topRight"
              content="The content in space. It cannot be moved. Can be destroyed, and after destruction, it becomes a space. The quantity is 10%~15% of the space"
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <h3>Stone</h3>
          <Slider
            value={stone}
            min={1}
            max={maxImmovable}
            onChange={(value) => setStone(value)}
          />
          <div className="cfg-count">{stone}</div>
        </li>
        <li>
          <div className="img-wrapper">
            <img src={holeImg} alt="Hole" />
            <Popover
              placement="topRight"
              content="The content in space. It cannot be moved. Can be destroyed, and after destruction, it becomes a space. The quantity is 10%~15% of the space"
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <h3>Hole</h3>
          <Slider
            value={hole}
            min={1}
            max={maxImmovable}
            onChange={(value) => setHole(value)}
          />
          <div className="cfg-count">{hole}</div>
        </li>
      </ul>

      <Link
        to="/map"
        state={{
          hole,
          stone,
          water,
          grass,
          space,
        }}
        className="go-map"
      >
        GO
      </Link>
    </div>
  );
};

export default Home;
