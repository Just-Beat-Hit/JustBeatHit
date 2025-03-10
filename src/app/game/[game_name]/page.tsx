import React from "react"
import SongList from "@/components/Karakaku/List";
import styles from "@/stylesheets/songList.module.scss";
import { CircleArrowLeft } from "lucide-react";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { Database } from "~/database.types";
import { notFound } from "next/navigation";

const GAME_NAMES: Database["public"]["Enums"]["game_name"][] = ["karakaku"];

export default async function Page({ params: { game_name } }: { params: { game_name: Database["public"]["Enums"]["game_name"] } }) {
    if (!GAME_NAMES.includes(game_name as Database["public"]["Enums"]["game_name"])) {
        return notFound()// If the user chooses a game that does not exist, then return 404
    }
    const supabaseAdmin = createAdminClient();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabaseAdmin.from("games").insert([{ game_name, user_id: user?.id! }]).select();

    console.debug("data", data);
    console.debug("error", error);

    /** If user choose karakaku, then display song list */
    if (game_name === "karakaku") {
        return (
            <div className={styles.container}>
                <a href="/" className={styles.backBtn}>
                    <CircleArrowLeft size={52} color="white" />
                </a>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>KARAKAKU</h1>
                </div>
                <p className={styles.subtitle}>Sélectionnez votre musique</p>
                <SongList gameId={data ? data[0].id : undefined} />
            </div>
        );
    }
}
