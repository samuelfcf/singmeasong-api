--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    name text NOT NULL,
    youtube_link text NOT NULL,
    score integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: musics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.musics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.musics_id_seq OWNER TO postgres;

--
-- Name: musics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.musics_id_seq OWNED BY public.recommendations.id;


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.musics_id_seq'::regclass);


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, name, youtube_link, score) FROM stdin;
82	Tasha e Tracie - Salve	https://www.youtube.com/watch?v=pA6OflrhYsw	22
91	auri sacra fame - don l	https://www.youtube.com/watch?v=IQYjoIQuQ1Q	0
83	agouro - tasha e tracie	https://www.youtube.com/watch?v=pv5czrZDKjs	7
85	MD Chefe - Tiffany	https://www.youtube.com/watch?v=iOM20kM2gOQ	5
86	fica puto - flacko	https://www.youtube.com/watch?v=aKxflHAvQxE	-1
89	Devaneios retianos - ret	https://www.youtube.com/watch?v=C49lLveQamo	10
90	TANG - tasha e tracie	https://www.youtube.com/watch?v=FrBkL97Yt5g	11
79	Caetano Veloso, Gilberto Gil - Esotérico	https://www.youtube.com/watch?v=axrewUxPYZ4	15
87	Filipe Ret - faça você mesmo	https://www.youtube.com/watch?v=NEKU3vPbBGk	5
92	Bob Marley - Concrete Jungle	https://www.youtube.com/watch?v=y07vgARrOUE	0
93	Bob Marley - Is this love	https://www.youtube.com/watch?v=69RdQFDuYPI	0
94	Bob Marley - I Shot The Sheriff	https://www.youtube.com/watch?v=sG52YAe8Crg	0
95	Bob Marley - Bufalo Soldier	https://www.youtube.com/watch?v=jjQgpB8eB7M	0
96	Bob Marley - No Woman no cry	https://www.youtube.com/watch?v=d4XhOBAKuPo	0
97	The Notorious B.I.G. - Big Poppa	https://www.youtube.com/watch?v=phaJXp_zMYM	0
84	Pedro Sampaio, caon e safa***	https://www.youtube.com/watch?v=5NsBJ9wWoLo	-2
\.


--
-- Name: musics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.musics_id_seq', 97, true);


--
-- Name: recommendations musics_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT musics_pk PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

