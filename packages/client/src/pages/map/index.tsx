import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  createEmptyData,
  expandMapData,
  flagToClassName,
  getAdjacentTypeCount,
  getFilledWallData,
  getFormatMUDData,
  getImmovableCount,
  getRandomMovableType,
  getRandomType,
  getTargetAroundPoint,
  isMovableType,
} from "../../utils";
import MapCell from "./MapCell";

import "./styles.scss";
import {
  LimitSpace,
  MaxImmovableCount,
  Side,
  TypeFlags,
  Types,
} from "../../contants";
import { message } from "antd";
import { useMUD } from "../../MUDContext";

import earthImg from "../../assets/earth.png";
import grassImg from "../../assets/grass.png";
import waterImg from "../../assets/water.png";
import wallImg from "../../assets/wall.png";
import stoneImg from "../../assets/stone.png";
import holeImg from "../../assets/hole.png";

const Map = () => {
  const width = 43;
  const height = 23;

  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0,
  });

  const { x: startX, y: startY } = vertexCoordinate;

  const [data, setData] = useState(createEmptyData(width, height));
  const [target, setTarget] = useState({
    x: ~~(width / 2),
    y: ~~(height / 2),
  });
  const cellClassCache = useRef({});
  const { state = {} } = useLocation();
  const cellTypeCount = useRef({ ...state });
  const [finished, setFinished] = useState(false);

  const staticData = useMemo(() => {
    return Array(height)
      .fill(0)
      .map(() => Array(width).fill(0));
  }, [width, height]);

  const {
    systemCalls: { move },
  } = useMUD();

  const init = () => {
    data[target.y][target.x] = TypeFlags.space;
    cellTypeCount.current.space--;
    setData([...data]);
  };

  const setAroundPoints = () => {
    const aroundPoints = getTargetAroundPoint(target);
    let lastImmovableCount =
      MaxImmovableCount - getImmovableCount([...aroundPoints, target], data);
    for (const point of aroundPoints) {
      if (cellTypeCount.current?.space === 0) {
        break;
      }
      if (data[point.y][point.x]) {
        continue;
      }
      const adjacentTypeCount = getAdjacentTypeCount(data, point);
      const type =
        lastImmovableCount <= 0
          ? getRandomMovableType(cellTypeCount.current, adjacentTypeCount)
          : getRandomType(cellTypeCount.current, adjacentTypeCount);
      data[point.y][point.x] = TypeFlags[type];
      if (type !== Types.wall) {
        cellTypeCount.current[type]--;
      }

      if (!isMovableType(type)) {
        lastImmovableCount--;
      }
    }
    setData([...data]);
  };

  const onKeyDown = (e) => {
    if (finished || e.keyCode < 37 || e.keyCode > 40) {
      return;
    }
    switch (e.keyCode) {
      case 37:
        target.x--;
        if (target.x === LimitSpace) {
          expandMapData(data, Side.left);
          target.x++;
        }
        if (target.x - vertexCoordinate.x === LimitSpace) {
          vertexCoordinate.x--;
        }
        break;
      case 38:
        target.y--;
        if (target.y === LimitSpace) {
          expandMapData(data, Side.top);
          target.y++;
        }
        if (target.y - vertexCoordinate.y === LimitSpace) {
          vertexCoordinate.y--;
        }
        break;
      case 39:
        target.x++;
        if (data[0].length - target.x === LimitSpace) {
          expandMapData(data, Side.right);
        }
        if (width - target.x + vertexCoordinate.x === LimitSpace) {
          vertexCoordinate.x++;
        }
        break;
      default:
        target.y++;
        if (data.length - target.y === LimitSpace) {
          expandMapData(data, Side.bottom);
        }
        if (height - target.y + vertexCoordinate.y === LimitSpace) {
          vertexCoordinate.y++;
        }
        break;
    }
    setTarget({
      ...target,
    });
    setVertexCoordinate({
      ...vertexCoordinate,
    });
    setData([...data]);
    setAroundPoints();
  };

  const save = async () => {
    try {
      const { start, end, mudData } = getFormatMUDData(data);
      await move(
        target.x - start.x,
        target.y - start.y,
        end.x - start.x,
        mudData
      );
    } catch (error) {
      // console.log("🚀 ~ file: index.tsx:165 ~ save ~ error:", error);
      // message.error(String(error), 6000);
    }
  };

  useEffect(() => {
    init();
    setAroundPoints();
  }, []);

  useEffect(() => {
    if (cellTypeCount.current?.space === 0) {
      message.info("The map is generated");
      setFinished(true);
      setData(getFilledWallData(data));
    }
  }, [cellTypeCount.current?.space]);

  return (
    <div className="mi-map-wrapper" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="tool-tip">
        <ul className="cfg-list">
          <li>
            <img src={earthImg} alt="Space" />
            <div className="type-count">{cellTypeCount.current.space}</div>
          </li>
          <li>
            <img src={grassImg} alt="Grass" />
            <div className="type-count">{cellTypeCount.current.grass}</div>
          </li>
          <li>
            <img src={waterImg} alt="Sea" />
            <div className="type-count">{cellTypeCount.current.water}</div>
          </li>
          <li>
            <img src={stoneImg} alt="Stone" />
            <div className="type-count">{cellTypeCount.current.stone}</div>
          </li>
          <li>
            <img src={holeImg} alt="Hole" />
            <div className="type-count">{cellTypeCount.current.hole}</div>
          </li>
        </ul>
        <div className="opt-wrapper">
          <button className="save" disabled={!finished} onClick={save}>
            Save
          </button>
          <button className="restart" onClick={() => window.location.reload()}>
            Restart
          </button>
          <button className="back">
            <Link to="/">Back</Link>
          </button>
        </div>
      </div>
      <div className="mi-map-content">
        {staticData.map((row, rowIndex) => {
          return (
            <div className="mi-map-row" key={startY + rowIndex}>
              {row.map((_, colIndex) => {
                const x = startX + colIndex;
                const y = startY + rowIndex;
                const isTarget = x === target.x && y === target.y;
                const typeClass = flagToClassName(data[y][x]);
                return (
                  <MapCell
                    key={startX + colIndex}
                    coordinate={{
                      x,
                      y,
                    }}
                    className={`${isTarget ? "target" : ""} ${typeClass}`}
                    mapData={data}
                    cellClassCache={cellClassCache}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Map;
