import { ArrowRight, InfoOutlined } from "@mui/icons-material"
import Master from "../../Layouts/Master"
import { Box, Button, Divider, Typography } from "@mui/material"


export default () => {
  return (
    <Master>
      <section className="info-sections">
        <Box className='info-side'>
          <h2 className="headline-2-info">
            A Contract for Passive Income Generation
          </h2>
          <p className="card-text">
            Are you ready to maximize the earning potential of your digital assets? Look no further than YieldTrinitySharedWallet - the DeFi platform that harnesses the power of automation and blockchain technology to generate passive income for its users.
          </p>

          <hr style={{ opacity: .1 }} />
          <div className="space-between">
            <Button variant='contained' onClick={() => window.location.href = '../account'}>
              GIVE IT A TRY
            </Button>
          </div>
        </Box>

        <Box className='info-side'>
          <p className="card-text">
            Our cutting-edge contract is specifically designed to trade and arbitrage funds on a decentralized exchange (DEX), utilizing automated strategies that take advantage of price inefficiencies and other opportunities to generate profits. This means that you can sit back and watch your digital assets grow without having to lift a finger!
          </p>
          <p className="card-text">
            With YieldTrinitySharedWallet, you'll no longer have to spend countless hours analyzing market trends or manually executing trades. Our platform offers a stress-free, streamlined approach to passive income generation, reducing the need for time-intensive activities and empowering you to focus on what really matters.
          </p>
          <p className="card-text">
            So why settle for less? Join the growing number of users who are earning lucrative returns on their digital assets with YieldTrinitySharedWallet. With our secure, transparent, and user-friendly platform, you can unlock the full potential of DeFi and start generating passive income today!
          </p>
        </Box>
      </section>
      {/* ANOTEHR SECTION */}
      <section className="info-sections" style={{ background: 'transparent' }}>
        <Box className="flexed-dash ">
          <h2 className="headline-2">
            Few Benefits of YieldTrinityMEVBots
          </h2>

          <div className="cards-wrapper">
            <div className="card-main">
              <h3 className="card-headine">Profitability</h3>
              <p className="card-text">
                By taking advantage of price differences and leading trades in decentralized finance (DeFi) markets,
                our MEV Bot can make large profits. This can be accomplished by scanning blockchain transactions,
                spotting advantageous chances, and carrying out trades automatically.
              </p>
            </div>
            <div className="card-main">
              <h3 className="card-headine">Speed</h3>
              <p className="card-text">
                Due to their blazing speed, our MEV Bots are able to front-run deals and seize profitable chances before other market participants.
                A competitive edge in DeFi marketplaces and increased earnings can result from this speed advantage.
              </p>
            </div>
            <div className="card-main">
              <h3 className="card-headine">Scalability</h3>
              <p className="card-text">
                Our MEV Bots are a flexible investment choice since they are simple to scale up or down to suit demand.
                MEV Bots can adjust to shifting market conditions and continue to make money when DeFi markets expand and change.
              </p>
            </div>


            <div className="card-main">
              <h3 className="card-headine">Efficiency</h3>
              <p className="card-text">
                Our MEV Bots may function around-the-clock without the need for human supervision by automating the process of finding and carrying out successful trades.
                This implies that even when the markets are closed, they may spot chances and make money.
              </p>
            </div>


            <div className="card-main">
              <h3 className="card-headine">Reduced risk</h3>
              <p className="card-text">
                The possibility of human error is decreased, and the risk of losses is reduced, by programming our MEV Bots to function under specific risk criteria.
                They become a more dependable and constant investment choice as a result.
              </p>
            </div>


            <div className="card-main">
              <h3 className="card-headine">Diversification</h3>
              <p className="card-text">
                A portfolio can benefit from diversification by investing in our MEV Bot.
                Investors can acquire exposure to a new asset class and possibly boost overall portfolio returns by increasing their exposure to DeFi markets.
              </p>
            </div>
          </div>

          <div className="space-between">
            <span></span>
            <div className="space-between">
              <a href={'#ip-not-allowed'} >
                <Button className=" primary-button">
                  mev repo <ArrowRight />
                </Button>
              </a>
              <a href={'#ip-not-allowed'} >
                <Button className=" primary-button">
                  shared wallet repo <ArrowRight />
                </Button>
              </a>
              <a href={'#ip-not-allowed'} >
                <Button className=" primary-button">
                  price oracle repo <ArrowRight />
                </Button>
              </a>
            </div>
          </div>
        </Box>

      </section>
      {/* ANOTEHR SECTION */}
      <section className="info-sections" style={{ background: 'transparent' }}>
        <Box className="flexed-dash ">
          <h2 className="headline-2">
            team alpha
          </h2>
          <div className="cards-wrapper wrap-four">
            <div className="card-main">
              <h3 className="card-headine">Samantha Chen </h3>
              <p className="card-text">
                <strong className="green">Lead Developer</strong><br /><br />
                Samantha has over 10 years of experience in software engineering and specializes in blockchain development.
                She has previously worked on several high-profile blockchain projects and is an expert in smart contract development.
              </p>
            </div>
            <div className="card-main">
              <h3 className="card-headine">David Kim</h3>
              <p className="card-text">
                <strong className="green">Product Manager</strong> <br /><br />
                David has 8 years of experience in product management and has worked on various products in the fintech industry.
                He is responsible for ensuring that the shared wallet meets the needs of users and is easy to use.
              </p>
            </div>
            <div className="card-main">
              <h3 className="card-headine">Rachel Lee</h3>
              <p className="card-text">
                <strong className="green">Marketing Manager</strong> <br /><br />
                Rachel has 5 years of experience in marketing and has worked for several tech startups in the past.
                She is responsible for creating and executing the marketing strategy for the shared wallet, including building brand awareness and user acquisition.
              </p>
            </div>
            <div className="card-main">
              <h3 className="card-headine">John Smith</h3>
              <p className="card-text">
                <strong className="green">Legal Advisor</strong><br /><br />
                John is a seasoned lawyer with over 15 years of experience in blockchain and fintech law.
                He is responsible for ensuring that the shared wallet is compliant with all relevant regulations and that users' funds are protected.
              </p>
            </div>
          </div>

          <div className="space-between">
            <span></span>
            <div className="space-between">
              <a href={'#ip-not-allowed'} >
                <Button className=" primary-button">
                  we are hiring <ArrowRight />
                </Button>
              </a>
            </div>
          </div>
        </Box>
      </section>
    </Master>
  )
}