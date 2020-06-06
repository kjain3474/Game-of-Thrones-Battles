import axios from 'axios';
import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import {useParams} from 'react-router-dom';

const Battles = (props) => {

  const battleLoc = useParams().battleLocation;
  const [allBattles, setAllBattles] = useState([]);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [attackerWinner, setAttackerWinner] = useState(null);

  useEffect(function(){
    try {
      axios
        .get(
          '/api/search?location=' +
            battleLoc
        )
        .then((response) => {
            setAllBattles(...allBattles, response.data);
        });
    } catch (err) {
       console.log(err);
    }
  // eslint-disable-next-line
  },[battleLoc])

  const setBattleData = (batteInfo) => {
     setCurrentBattle(batteInfo);
  }

  const setWinner = (outcome) => {
    setAttackerWinner(outcome)
  }
  

  return (

    <div className="Battles">
      <img
        src="/GOTLogo.png"
        className="fadeInUp"
        alt="logo"
        style={{animationDelay: '0.3s', width: '100%'}}
      />
      <img
        src="/sword.png"
        alt="sword"
        className="fadeInUp"
        style={{position: 'relative', animationDelay: '0.1s', width: '50vh', height: '100px'}}
      />

      {allBattles && !currentBattle && (
        <React.Fragment>
          {allBattles.map((result, index) => {

            return (
              <div key ={index} onClick={() => setBattleData(result)} className="alert fadeInUp" style={{animationDelay: '0.7s'}}>

                 <div>
                    <div className="badge labels label-item">{`#${result.battle_number}`}</div>
                </div>

                <div className="alert-centre is-full">                
                  <h1>{`${result.name}`}</h1>
                  <div className="kings blue">{result.attacker_king === ""?"Anonymous": result.attacker_king}</div>
                  <div className="versus" style={{fontStyle: "bold"}}>VS</div>
                  <div className="kings pink">{result.defender_king === ""?"Anonymous": result.defender_king}</div>
                </div>

                <div>
                      <Icon.ArrowRightCircle size={14} />
                </div>
              </div>
            );

            })}
        </React.Fragment>
      )}

      {currentBattle && (
        <div className="BattleInfo fadeInUp">


          <div className="TopBar">
            <div style={{fontSize: "0.7rem", letterSpacing: "0.2rem"}}><span>              
              <Icon.X
                style={{color: "white"}}
                size={16}
                onClick={() => {
                  setCurrentBattle(null);
                  setAttackerWinner(null);
                }}
              /></span>TONIGHT'S BATTLE</div>
            <div className="title" >{currentBattle.name}</div>
            <div className="infobox">
                <div><h3>Year: </h3><span>{currentBattle.year}</span></div>
                <div><h3>Type: </h3><span>{currentBattle.battle_type}</span></div>
                <div><h3>Location: </h3><span>{currentBattle.location}</span></div>
                <div><h3>Region: </h3><span>{currentBattle.region}</span></div>
            </div>
          </div>


          <div className="fights">

                <div className={`fighter blue ${attackerWinner !== "loss"? "" : "loser"}`}>
                  {attackerWinner === "win" && (<div className="winner">Winner</div>)}
                  <div className="title">Attackers</div>
                  <div className="info">King</div>
                  <div>&#9876; {currentBattle.attacker_king}</div>
                  <div className="info">Army Size</div>
                  <div><span><Icon.Shield
                  size={14} /></span> {currentBattle.attacker_size === "" ? 0 : currentBattle.attacker_size}</div>
                  <div className="info">Army Chiefs</div>
                  <div><span><Icon.Key
                  size={14} /></span> {currentBattle.attacker_commander}</div>
                  <div className="info">Attacker Families</div>
                  <div>{currentBattle.attacker_1}</div>
                  <div>{currentBattle.attacker_2}</div>
                  <div>{currentBattle.attacker_3}</div>
                  <div>{currentBattle.attacker_4}</div>
                </div> 
                <div className={`fighter pink ${attackerWinner === "win"? "loser" : ""}`}>
                  {attackerWinner === "loss" && (<div className="winner">Winner</div>)}
                  <div className="title">Defenders</div>
                  <div className="info">King</div>
                  <div>&#9876; {currentBattle.defender_king}</div>
                  <div className="info">Army Size</div>
                  <div><span><Icon.Shield
                  size={14} /></span> {currentBattle.defender_size === "" ? 0 : currentBattle.defender_size}</div>
                  <div className="info">Army Chiefs</div>
                  <div><span><Icon.Key
                  size={14} /></span> {currentBattle.defender_commander}</div>
                  <div className="info">Defender Families</div>
                  <div>{currentBattle.defender_1}</div>
                  <div>{currentBattle.defender_2}</div>
                  <div>{currentBattle.defender_3}</div>
                  <div>{currentBattle.defender_4}</div>
                </div>

          </div>

          <button
            className="button-fight fadeInUp"
            onClick ={() => setWinner(currentBattle.attacker_outcome)}
            style={{marginTop : "1em", textAlign: "center"}}
          >
          Start Fight
          </button>


        </div>
      )}

    </div>
  );
};
export default Battles;
