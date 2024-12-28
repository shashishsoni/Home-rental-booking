import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import {
  FaSkiing,
  FaPumpSoap,
  FaShower,
  FaFireExtinguisher,
  FaUmbrellaBeach,
  FaKey,
} from "react-icons/fa";
import { FaHouseUser, FaPeopleRoof, FaKitchenSet } from "react-icons/fa6";
import {
  BiSolidWasher,
  BiSolidDryer,
  BiSolidFirstAid,
  BiWifi,
  BiSolidFridge,
  BiWorld,
} from "react-icons/bi";
import { BsSnow, BsFillDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla, MdMicrowave, MdBalcony, MdYard, MdPets } from "react-icons/md";
import {
  PiBathtubFill,
  PiCoatHangerFill,
  PiTelevisionFill,
} from "react-icons/pi";
import { TbIroning3 } from "react-icons/tb";
import {
  GiHeatHaze,
  GiCctvCamera,
  GiBarbecue,
  GiToaster,
  GiCampfire,
} from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";

import allImg from "@/assets/all.jpg";
import beachImg from "@/assets/beach.jpg";
import windmillImg from "@/assets/windmil.avif";
import iconCityImg from "@/assets/iconcity.jpg";
import countrysideImg from "@/assets/countryside.webp";
import poolImg from "@/assets/pool.jpg";
import islandImg from "@/assets/island.avif";
import lakefrontImg from "@/assets/lakefront.jpg";
import skiImg from "@/assets/ski_in.avif";
import castlesImg from "@/assets/castles.jpg";
import caveImg from "@/assets/cave.jpg";
import campingImg from "@/assets/camping.jpg";
import arcticImg from "@/assets/artic.webp";
import desertImg from "@/assets/derset.avif";
import barnImg from "@/assets/barn.webp";
import luxuryImg from "@/assets/luxury.webp";

export const categories = [
  {
    img: allImg,
    label: "All",
    icon: BiWorld,
  },
  {
    img: beachImg,
    label: "Beachfront",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    img: windmillImg,
    label: "Windmills",
    icon: GiWindmill,
    description: "This property has windmills!",
  },
  {
    img: iconCityImg,
    label: "Iconic cities",
    icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    img: countrysideImg,
    label: "Countryside",
    icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    img: poolImg,
    label: "Amazing Pools",
    icon: TbPool,
    description: "This property has a beautiful pool!",
  },
  {
    img: islandImg,
    label: "Islands",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    img: lakefrontImg,
    label: "Lakefront",
    icon: GiBoatFishing,
    description: "This property is near a lake!",
  },
  {
    img: skiImg,
    label: "Ski-in/out",
    icon: FaSkiing,
    description: "This property has skiing activities!",
  },
  {
    img: castlesImg,
    label: "Castles",
    icon: GiCastle,
    description: "This property is an ancient castle!",
  },
  {
    img: caveImg,
    label: "Caves",
    icon: GiCaveEntrance,
    description: "This property is in a spooky cave!",
  },
  {
    img: campingImg,
    label: "Camping",
    icon: GiForestCamp,
    description: "This property offers camping activities!",
  },
  {
    img: arcticImg,
    label: "Arctic",
    icon: BiWorld,
    description: "This property is in an arctic environment!",
  },
  {
    img: desertImg,
    label: "Desert",
    icon: GiCactus,
    description: "This property is in the desert!",
  },
  {
    img: barnImg,
    label: "Barns",
    icon: GiBarn,
    description: "This property is in a barn!",
  },
  {
    img: luxuryImg,
    label: "Luxury",
    icon: IoDiamond,
    description: "This property is brand new and luxurious!",
  },
];

export const types = [
  {
    name: "An entire place",
    description: "Guests have the whole place to themselves",
    icon: <FaHouseUser />,
  },
  {
    name: "Room(s)",
    description:
      "Guests have their own room in a house, plus access to shared places",
    icon: <BsFillDoorOpenFill />,
  },
  {
    name: "A Shared Room",
    description:
      "Guests sleep in a room or common area that maybe shared with you or others",
    icon: <FaPeopleRoof />,
  },
];

export const facilities = [
  {
    name: "Bath tub",
    icon: <PiBathtubFill />,
  },
  {
    name: "Personal care products",
    icon: <FaPumpSoap />,
  },
  {
    name: "Outdoor shower",
    icon: <FaShower />,
  },
  {
    name: "Washer",
    icon: <BiSolidWasher />,
  },
  {
    name: "Dryer",
    icon: <BiSolidDryer />,
  },
  {
    name: "Hangers",
    icon: <PiCoatHangerFill />,
  },
  {
    name: "Iron",
    icon: <TbIroning3 />,
  },
  {
    name: "TV",
    icon: <PiTelevisionFill />,
  },
  {
    name: "Dedicated workspace",
    icon: <BsPersonWorkspace />
  },
  {
    name: "Air Conditioning",
    icon: <BsSnow />,
  },
  {
    name: "Heating",
    icon: <GiHeatHaze />,
  },
  {
    name: "Security cameras",
    icon: <GiCctvCamera />,
  },
  {
    name: "Fire extinguisher",
    icon: <FaFireExtinguisher />,
  },
  {
    name: "First Aid",
    icon: <BiSolidFirstAid />,
  },
  {
    name: "Wifi",
    icon: <BiWifi />,
  },
  {
    name: "Cooking set",
    icon: <FaKitchenSet />,
  },
  {
    name: "Refrigerator",
    icon: <BiSolidFridge />,
  },
  {
    name: "Microwave",
    icon: <MdMicrowave />,
  },
  {
    name: "Stove",
    icon: <GiToaster />,
  },
  {
    name: "Barbecue grill",
    icon: <GiBarbecue />,
  },
  {
    name: "Outdoor dining area",
    icon: <FaUmbrellaBeach />,
  },
  {
    name: "Private patio or Balcony",
    icon: <MdBalcony />,
  },
  {
    name: "Camp fire",
    icon: <GiCampfire />,
  },
  {
    name: "Garden",
    icon: <MdYard />,
  },
  {
    name: "Free parking",
    icon: <AiFillCar />,
  },
  {
    name: "Self check-in",
    icon: <FaKey />
  },
  {
    name: "Pet allowed",
    icon: <MdPets />
  }
];