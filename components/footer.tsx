import { user } from "@/data/general";
import CopyEmail from "./portfolio/copy-email";

export default function Footer() {
  return (
    <footer className="mx-auto mt-16 w-[min(680px,calc(100%-40px))] shrink-0 pb-8 text-[14px] text-secondary-foreground pointer-fine:[&_a:hover]:text-foreground [@media(max-width:640px)]:mt-12">
      <div className="flex items-center justify-between gap-5 py-[25px] [&_a]:text-foreground [&_a]:underline [&_a]:decoration-underline [&_a]:underline-offset-4 [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-3">
        <p>
          have something in mind? <a href={user.socials.mail}>let’s talk</a>.
        </p>
        <CopyEmail />
      </div>
      <div className="flex items-center justify-between gap-5 pt-2 pb-8 text-[13px] [&>div]:flex [&>div]:flex-wrap [&>div]:gap-[18px] [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-3">
        <div>
          <a href={user.socials.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href={user.socials.twitter} target="_blank" rel="noreferrer">
            x / twitter
          </a>
          <a href={user.socials.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </div>
        <div>
          <a href="/resume/resume.pdf" target="_blank" rel="noreferrer">
            resume ↗
          </a>
          <a href={user.socials.calcom} target="_blank" rel="noreferrer">
            book a chat ↗
          </a>
        </div>
      </div>
      <div className="flex justify-between gap-4 pt-[18px] text-[12px] text-muted-foreground [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-1">
        <span>
          © {new Date().getFullYear()} {user.name}
        </span>
        <span>from bhaktapur, nepal</span>
      </div>
    </footer>
  );
}
